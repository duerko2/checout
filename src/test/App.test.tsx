import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import Delivery from "../App";


describe(Delivery.name, () => {
    it("should render", () => {
        render(<Delivery/>)
        expect(screen.getByRole(
            "button",
            { name: /Go To Payment/i }
        )).toBeInTheDocument();
    });
});

