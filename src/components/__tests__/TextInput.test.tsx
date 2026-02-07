import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "../TextInput";

describe("TextInput", () => {
  const defaultProps = {
    onGenerate: vi.fn(),
    isGenerating: false,
  };

  it("renders the textarea and generate button", () => {
    render(<TextInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/describe the music/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate music/i })).toBeInTheDocument();
  });

  it("disables the button when textarea is empty", () => {
    render(<TextInput {...defaultProps} />);
    expect(screen.getByRole("button", { name: /generate music/i })).toBeDisabled();
  });

  it("enables the button when text is entered", () => {
    render(<TextInput {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText(/describe the music/i), {
      target: { value: "Lo-fi chill" },
    });
    expect(screen.getByRole("button", { name: /generate music/i })).toBeEnabled();
  });

  it("calls onGenerate with the prompt when button is clicked", () => {
    const onGenerate = vi.fn();
    render(<TextInput {...defaultProps} onGenerate={onGenerate} />);

    fireEvent.change(screen.getByPlaceholderText(/describe the music/i), {
      target: { value: "Epic orchestral" },
    });
    fireEvent.click(screen.getByRole("button", { name: /generate music/i }));

    expect(onGenerate).toHaveBeenCalledWith("Epic orchestral");
  });

  it("shows 'Generating...' text when isGenerating is true", () => {
    render(<TextInput {...defaultProps} isGenerating={true} />);
    expect(screen.getByRole("button", { name: /generating/i })).toBeInTheDocument();
  });

  it("renders suggestion chips that fill the textarea", () => {
    render(<TextInput {...defaultProps} />);
    const suggestion = screen.getByText("Lo-fi beats for a rainy evening");
    fireEvent.click(suggestion);

    const textarea = screen.getByPlaceholderText(/describe the music/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe("Lo-fi beats for a rainy evening");
  });

  it("renders all 4 suggestion chips", () => {
    render(<TextInput {...defaultProps} />);
    expect(screen.getByText("Lo-fi beats for a rainy evening")).toBeInTheDocument();
    expect(screen.getByText("Epic orchestral trailer music")).toBeInTheDocument();
    expect(screen.getByText(/Ambient soundscape/i)).toBeInTheDocument();
    expect(screen.getByText(/Funky bass-driven/i)).toBeInTheDocument();
  });
});
