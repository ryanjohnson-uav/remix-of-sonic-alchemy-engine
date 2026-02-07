import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

// Mock heavy components to keep tests fast and focused on routing
vi.mock("@/components/HeroSection", () => ({
  default: () => <div data-testid="hero-section">Hero</div>,
}));

vi.mock("@/components/GenerationStudio", () => ({
  default: () => <div data-testid="generation-studio">GenerationStudio</div>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/components/studio/StudioWorkspace", () => ({
  default: () => <div data-testid="studio-workspace">StudioWorkspace</div>,
}));

// We need to override BrowserRouter since App uses it internally
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("App routing", () => {
  it("renders the Index page at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("generation-studio")).toBeInTheDocument();
  });

  it("renders the Studio page at /studio", () => {
    render(
      <MemoryRouter initialEntries={["/studio"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("studio-workspace")).toBeInTheDocument();
  });

  it("renders the NotFound page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-page"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
