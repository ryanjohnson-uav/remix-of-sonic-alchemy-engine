import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GenerationStudio from "../GenerationStudio";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
  },
}));

describe("GenerationStudio", () => {
  it("renders the Create heading", () => {
    render(<GenerationStudio />);
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders all three input mode cards", () => {
    render(<GenerationStudio />);
    expect(screen.getByText("Text to Music")).toBeInTheDocument();
    expect(screen.getByText("Image to Music")).toBeInTheDocument();
    expect(screen.getByText("Voice to Music")).toBeInTheDocument();
  });

  it("shows text input by default", () => {
    render(<GenerationStudio />);
    expect(screen.getByPlaceholderText(/describe the music/i)).toBeInTheDocument();
  });

  it("switches to image input when Image to Music is clicked", () => {
    render(<GenerationStudio />);
    fireEvent.click(screen.getByText("Image to Music"));
    expect(screen.getByText(/upload an image/i)).toBeInTheDocument();
  });

  it("switches to voice input when Voice to Music is clicked", () => {
    render(<GenerationStudio />);
    fireEvent.click(screen.getByText("Voice to Music"));
    expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
  });

  it("renders recent generations section", () => {
    render(<GenerationStudio />);
    expect(screen.getByText("Recent Generations")).toBeInTheDocument();
  });

  it("displays mock generation items", () => {
    render(<GenerationStudio />);
    // "Lo-fi beats..." appears both as a suggestion chip and a generation card
    expect(screen.getAllByText("Lo-fi beats for a rainy evening").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Sunset beach ambient mix")).toBeInTheDocument();
    expect(screen.getByText("Hummed melody expansion")).toBeInTheDocument();
  });
});
