import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
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
    test("should render", () => {
        render(<Delivery/>)
        const input = screen.getByRole("textbox", { name: /name/i });
        fireEvent.change(input, { target: { value: "test" } });
        expect(input).toHaveValue("test");

    })
});

