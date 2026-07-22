import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  test("shows a validation error when full name is left empty", async () => {
    render(<SettingsForm />);

    // Fill in a valid email so we isolate the full name error specifically.
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    // Leave "Full name" empty and submit the form.
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    // The inline error message should appear below the field.
    const error = await screen.findByText(/full name is required/i);
    expect(error).toBeInTheDocument();
  });
});