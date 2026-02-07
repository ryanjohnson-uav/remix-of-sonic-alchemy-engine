import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import VoiceInput from "../VoiceInput";

describe("VoiceInput", () => {
  const defaultProps = {
    onGenerate: vi.fn(),
    isGenerating: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the mic button and instruction text", () => {
    render(<VoiceInput {...defaultProps} />);
    expect(screen.getByText(/tap to record/i)).toBeInTheDocument();
  });

  it("disables generate button before recording", () => {
    render(<VoiceInput {...defaultProps} />);
    expect(screen.getByRole("button", { name: /generate from voice/i })).toBeDisabled();
  });

  it("shows 'Recording...' text after clicking the mic", () => {
    render(<VoiceInput {...defaultProps} />);
    // The mic button is the first button (not the generate button)
    const buttons = screen.getAllByRole("button");
    const micButton = buttons[0];

    fireEvent.click(micButton);
    expect(screen.getByText(/recording\.\.\./i)).toBeInTheDocument();
  });

  it("enables generate button after recording and stopping", () => {
    render(<VoiceInput {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    const micButton = buttons[0];

    // Start recording
    fireEvent.click(micButton);

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Stop recording
    fireEvent.click(micButton);

    expect(screen.getByRole("button", { name: /generate from voice/i })).toBeEnabled();
  });

  it("calls onGenerate when generate button is clicked after recording", () => {
    const onGenerate = vi.fn();
    render(<VoiceInput {...defaultProps} onGenerate={onGenerate} />);
    const buttons = screen.getAllByRole("button");

    // Record and stop
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);

    // Click generate
    fireEvent.click(screen.getByRole("button", { name: /generate from voice/i }));
    expect(onGenerate).toHaveBeenCalledWith("Voice-to-music generation");
  });

  it("shows processing text when generating", () => {
    render(<VoiceInput {...defaultProps} isGenerating={true} />);
    expect(screen.getByRole("button", { name: /processing voice/i })).toBeInTheDocument();
  });
});
