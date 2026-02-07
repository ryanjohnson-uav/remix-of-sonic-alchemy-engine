import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/types/studio";
import { mapToneToFrequency, clamp } from "@/lib/audioUtils";

interface TrackNodes {
  element: HTMLAudioElement;
  source?: MediaElementAudioSourceNode;
  gain?: GainNode;
  panner?: StereoPannerNode;
  filter?: BiquadFilterNode;
  src?: string;
}

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const Context =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return Context ? new Context() : null;
};

export const useTrackAudioEngine = (tracks: Track[]) => {
  const [playingMap, setPlayingMap] = useState<Record<string, boolean>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolume] = useState(85);

  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Map<string, TrackNodes>>(new Map());
  const tracksRef = useRef<Track[]>(tracks);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const ensureContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const context = getAudioContext();
    if (!context) return null;
    const masterGain = context.createGain();
    masterGain.gain.value = masterVolume / 100;
    masterGain.connect(context.destination);
    contextRef.current = context;
    masterGainRef.current = masterGain;
    return context;
  }, [masterVolume]);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = masterVolume / 100;
    }
  }, [masterVolume]);

  const registerTrack = useCallback(
    (track: Track) => {
      if (!track.audioUrl) return;
      const existing = nodesRef.current.get(track.id);
      if (existing) {
        if (existing.src !== track.audioUrl) {
          existing.element.src = track.audioUrl;
          existing.element.load();
          existing.src = track.audioUrl;
        }
        return;
      }

      const audio = new Audio(track.audioUrl);
      audio.preload = "metadata";
      audio.crossOrigin = "anonymous";
      audio.loop = false;
      audio.volume = track.volume / 100;
      const pitchable = audio as HTMLAudioElement & {
        preservesPitch?: boolean;
        mozPreservesPitch?: boolean;
        webkitPreservesPitch?: boolean;
      };
      if ("preservesPitch" in pitchable) pitchable.preservesPitch = false;
      if ("mozPreservesPitch" in pitchable) pitchable.mozPreservesPitch = false;
      if ("webkitPreservesPitch" in pitchable) pitchable.webkitPreservesPitch = false;

      const nodes: TrackNodes = { element: audio, src: track.audioUrl };
      const context = ensureContext();

      if (context) {
        const source = context.createMediaElementSource(audio);
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        const panner = context.createStereoPanner();
        const gain = context.createGain();

        source.connect(filter);
        filter.connect(panner);
        panner.connect(gain);
        const master = masterGainRef.current ?? context.destination;
        gain.connect(master);

        nodes.source = source;
        nodes.filter = filter;
        nodes.panner = panner;
        nodes.gain = gain;
      }

      audio.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(audio.duration)) {
          setDurations((prev) => ({ ...prev, [track.id]: audio.duration }));
        }
      });

      audio.addEventListener("ended", () => {
        setPlayingMap((prev) => ({ ...prev, [track.id]: false }));
      });

      audio.addEventListener("timeupdate", () => {
        const current = tracksRef.current.find((item) => item.id === track.id);
        if (!current) return;
        const trimEnd = current.trimEnd ?? (Number.isFinite(audio.duration) ? audio.duration : undefined);
        if (trimEnd === undefined) return;
        if (audio.currentTime >= trimEnd) {
          if (current.loop) {
            audio.currentTime = current.trimStart ?? 0;
            audio.play().catch(() => undefined);
          } else {
            audio.pause();
            setPlayingMap((prev) => ({ ...prev, [track.id]: false }));
          }
        }
      });

      nodesRef.current.set(track.id, nodes);
    },
    [ensureContext]
  );

  useEffect(() => {
    tracks.forEach(registerTrack);

    const activeIds = new Set(tracks.map((track) => track.id));
    nodesRef.current.forEach((nodes, id) => {
      if (activeIds.has(id)) return;
      nodes.element.pause();
      nodes.source?.disconnect();
      nodes.filter?.disconnect();
      nodes.panner?.disconnect();
      nodes.gain?.disconnect();
      nodesRef.current.delete(id);
      setPlayingMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDurations((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });
  }, [registerTrack, tracks]);

  const applyTrackSettings = useCallback((track: Track) => {
    const nodes = nodesRef.current.get(track.id);
    if (!nodes) return;

    const anySolo = tracksRef.current.some((item) => item.solo);
    const muted = track.muted || (anySolo && !track.solo);
    const volume = muted ? 0 : clamp(track.volume / 100, 0, 1);

    if (nodes.gain) {
      nodes.gain.gain.value = volume;
    } else {
      nodes.element.volume = volume;
    }

    if (nodes.panner) {
      nodes.panner.pan.value = clamp(track.pan / 50, -1, 1);
    }

    if (nodes.filter) {
      nodes.filter.frequency.value = mapToneToFrequency(track.tone);
    }

    const pitchFactor = Math.pow(2, track.pitch / 12);
    nodes.element.playbackRate = clamp(track.playbackRate * pitchFactor, 0.25, 3);
    nodes.element.loop = false;
  }, []);

  useEffect(() => {
    tracks.forEach(applyTrackSettings);
  }, [applyTrackSettings, tracks]);

  const playTrack = useCallback(
    async (trackId: string) => {
      const nodes = nodesRef.current.get(trackId);
      if (!nodes) return;

      const context = ensureContext();
      if (context?.state === "suspended") {
        await context.resume();
      }

      const current = tracksRef.current.find((track) => track.id === trackId);
      if (current) {
        const trimStart = current.trimStart ?? 0;
        const duration = nodes.element.duration;
        if (Number.isFinite(duration)) {
          nodes.element.currentTime = clamp(trimStart, 0, duration);
        } else {
          nodes.element.currentTime = trimStart;
        }
      }

      try {
        await nodes.element.play();
        setPlayingMap((prev) => ({ ...prev, [trackId]: true }));
      } catch (error) {
        console.error("Failed to play track:", error);
        setPlayingMap((prev) => ({ ...prev, [trackId]: false }));
      }
    },
    [ensureContext]
  );

  const pauseTrack = useCallback((trackId: string) => {
    const nodes = nodesRef.current.get(trackId);
    if (!nodes) return;
    nodes.element.pause();
    setPlayingMap((prev) => ({ ...prev, [trackId]: false }));
  }, []);

  const stopTrack = useCallback((trackId: string) => {
    const nodes = nodesRef.current.get(trackId);
    if (!nodes) return;
    const current = tracksRef.current.find((track) => track.id === trackId);
    nodes.element.pause();
    nodes.element.currentTime = current?.trimStart ?? 0;
    setPlayingMap((prev) => ({ ...prev, [trackId]: false }));
  }, []);

  const toggleTrack = useCallback(
    (trackId: string) => {
      if (playingMap[trackId]) {
        pauseTrack(trackId);
      } else {
        playTrack(trackId);
      }
    },
    [pauseTrack, playTrack, playingMap]
  );

  const playAll = useCallback(async () => {
    const playable = tracksRef.current.filter((track) => track.audioUrl);
    await Promise.all(playable.map((track) => playTrack(track.id)));
  }, [playTrack]);

  const pauseAll = useCallback(() => {
    tracksRef.current.forEach((track) => pauseTrack(track.id));
  }, [pauseTrack]);

  const stopAll = useCallback(() => {
    tracksRef.current.forEach((track) => stopTrack(track.id));
  }, [stopTrack]);

  const isAnyPlaying = useMemo(
    () => Object.values(playingMap).some(Boolean),
    [playingMap]
  );

  const isTrackPlaying = useCallback(
    (trackId: string) => Boolean(playingMap[trackId]),
    [playingMap]
  );

  return {
    playTrack,
    pauseTrack,
    stopTrack,
    toggleTrack,
    playAll,
    pauseAll,
    stopAll,
    isTrackPlaying,
    isAnyPlaying,
    durations,
    masterVolume,
    setMasterVolume,
  };
};
