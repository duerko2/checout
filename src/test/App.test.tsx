import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import App from "../App";


describe(App.name, () => {
    it("should render", () => {
        render(<App/>)
        expect(screen.getByText("GRAND TOTAL: 0.00")).toBeInTheDocument();
    });
    it("should render", () => {
        render(<App/>)
        expect(screen.getByText("Basket")).toBeInTheDocument();
    });
});

