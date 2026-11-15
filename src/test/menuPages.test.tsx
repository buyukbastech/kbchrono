import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@/i18n/config";
import CollectionGrid from "@/components/CollectionGrid";

describe("5 Luxury Menu Routes & CollectionGrid", () => {
  it("renders KOLEKSİYONLAR without Bento Hero or Live Try-On Studio buttons", () => {
    render(
      <MemoryRouter>
        <CollectionGrid />
      </MemoryRouter>
    );
    expect(screen.queryByText(/LIVE TRY-ON \/ STUDIO/i)).toBeNull();
    expect(screen.queryByText(/SCARCITY TELEMETRY/i)).toBeNull();
    expect(screen.getAllByText(/Patek Philippe Nautilus/i).length).toBeGreaterThan(0);
  });

  it("renders RARE BAGS category cleanly", () => {
    render(
      <MemoryRouter>
        <CollectionGrid fixedCollection="Rare Bags" />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Birkin 30/i).length).toBeGreaterThan(0);
  });

  it("renders JEWELLERY category cleanly", () => {
    render(
      <MemoryRouter>
        <CollectionGrid fixedCollection="Jewellery" />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Snowflake VVS1/i).length).toBeGreaterThan(0);
  });

  it("renders PERSONALIZATION category cleanly", () => {
    render(
      <MemoryRouter>
        <CollectionGrid fixedCollection="Personalization" />
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(/Bespoke Matte Alligator/i).length
    ).toBeGreaterThan(0);
  });

  it("renders OLD MONEY category cleanly", () => {
    render(
      <MemoryRouter>
        <CollectionGrid fixedCollection="Old Money" />
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(/1987 Heritage Rose Gold Tourbillon/i).length
    ).toBeGreaterThan(0);
  });
});
