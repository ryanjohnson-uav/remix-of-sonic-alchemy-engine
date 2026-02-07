import { supabase } from "@/integrations/supabase/client";

export interface LibraryItem {
  id: string;
  title: string;
  prompt?: string;
  createdAt: string;
  durationSeconds: number;
  url: string;
  source: "generated" | "uploaded" | "preset";
  storagePath?: string;
  isLocalFallback?: boolean;
}

const LIBRARY_STORAGE_KEY = "sonicforge.library.v1";
const MUSIC_LIBRARY_BUCKET = "music-library";

const safeParse = (value: string | null): LibraryItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as LibraryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistLibrary = (items: LibraryItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
};

export const loadLibraryItems = () => {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(LIBRARY_STORAGE_KEY));
};

const upsertLibraryItem = (item: LibraryItem) => {
  const current = loadLibraryItems();
  const without = current.filter((existing) => existing.id !== item.id);
  const next = [item, ...without].slice(0, 50);
  persistLibrary(next);
  return next;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48) || "track";

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert audio to data URL"));
    reader.readAsDataURL(blob);
  });

export interface StoreTrackInput {
  title: string;
  prompt?: string;
  blob: Blob;
  durationSeconds: number;
  source: LibraryItem["source"];
}

export const storeGeneratedTrack = async ({
  title,
  prompt,
  blob,
  durationSeconds,
  source,
}: StoreTrackInput) => {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const createdAt = new Date().toISOString();
  const extension = blob.type.includes("wav") ? "wav" : "mp3";
  const fileName = `${slugify(title)}-${id}.${extension}`;
  const objectUrl = URL.createObjectURL(blob);
  let url = objectUrl;
  let storagePath: string | undefined;
  let isLocalFallback = false;

  try {
    const file = new File([blob], fileName, { type: blob.type || "audio/mpeg" });
    const { data, error } = await supabase.storage
      .from(MUSIC_LIBRARY_BUCKET)
      .upload(fileName, file, { upsert: true, contentType: file.type });

    if (error) throw error;
    storagePath = data?.path ?? fileName;
    const { data: publicData } = supabase.storage
      .from(MUSIC_LIBRARY_BUCKET)
      .getPublicUrl(storagePath);
    if (publicData?.publicUrl) {
      url = publicData.publicUrl;
      URL.revokeObjectURL(objectUrl);
    }
  } catch (error) {
    console.warn("Falling back to local library storage:", error);
    url = await blobToDataUrl(blob);
    isLocalFallback = true;
    URL.revokeObjectURL(objectUrl);
  }

  const item: LibraryItem = {
    id,
    title,
    prompt,
    createdAt,
    durationSeconds,
    url,
    source,
    storagePath,
    isLocalFallback,
  };

  const updated = upsertLibraryItem(item);
  return { item, updated };
};
