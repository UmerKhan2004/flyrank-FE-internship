import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/ui/SearchBar";

describe("SearchBar", () => {
  it("renders search input and button", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    expect(screen.getByLabelText("Movie title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("calls onSearch with query when form is submitted", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByLabelText("Movie title");
    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).toHaveBeenCalledWith("Inception", "");
  });

  it("disables button when loading", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables button when query is empty", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has accessible form role", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });
});