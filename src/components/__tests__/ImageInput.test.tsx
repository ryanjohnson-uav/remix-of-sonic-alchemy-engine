import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ImageInput from "../ImageInput";

describe("ImageInput", () => {
  const defaultProps = {
    onGenerate: vi.fn(),
    isGenerating: false,
  };

  it("renders the upload area when no image is selected", () => {
    render(<ImageInput {...defaultProps} />);
    expect(screen.getByText(/upload an image/i)).toBeInTheDocument();
    expect(screen.getByText(/JPG, PNG, WebP/i)).toBeInTheDocument();
  });

  it("renders the mood input field", () => {
    render(<ImageInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/mood or style hint/i)).toBeInTheDocument();
  });

  it("disables generate button when no image is uploaded", () => {
    render(<ImageInput {...defaultProps} />);
    expect(screen.getByRole("button", { name: /generate from image/i })).toBeDisabled();
  });

  it("shows translating text when generating", () => {
    render(<ImageInput {...defaultProps} isGenerating={true} />);
    expect(screen.getByRole("button", { name: /translating image/i })).toBeInTheDocument();
  });

  it("has a hidden file input accepting images", () => {
    render(<ImageInput {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    expect(fileInput.accept).toBe("image/*");
    expect(fileInput.className).toContain("hidden");
  });
});
