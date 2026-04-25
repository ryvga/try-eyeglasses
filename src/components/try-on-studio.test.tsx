// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TryOnStudio } from "@/components/try-on-studio";

describe("TryOnStudio", () => {
  it("opens camera capture in a centered dialog", async () => {
    const track = { stop: vi.fn() };
    const stream = { getTracks: () => [track] };
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(stream),
      },
    });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

    render(<TryOnStudio />);

    await userEvent.click(screen.getByRole("button", { name: "Camera" }));

    expect(await screen.findByText("Take a photo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use this photo" })).toBeInTheDocument();
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
    });
  });
});
