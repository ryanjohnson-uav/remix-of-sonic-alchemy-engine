import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Navbar", () => {
  it("renders the SonicForge brand name", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText("SonicForge")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Studio")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });

  it("renders the sign in button", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("Studio link points to /studio", () => {
    renderWithRouter(<Navbar />);
    const studioLink = screen.getByText("Studio").closest("a");
    expect(studioLink?.getAttribute("href")).toBe("/studio");
  });
});
