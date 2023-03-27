import { render, screen } from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {useState} from "react";
import {Basket} from "../Basket";
import {Order, Product} from "../types";
import userEvent from '@testing-library/user-event'
import App from "../App";


describe(App.name, async () => {
    it("should render", () => {
        render(<App/>)
        expect(screen.findByRole(
            "button",
            { name: /-/i }
        )).toBeInTheDocument();
    });
});

function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

test('render basket with dummy order', async () => {
    const {user} = setup(<App/>)


    const minusButtons:HTMLElement[] = await screen.findAllByRole("button", {name: /-/i});
    const plusButtons:HTMLElement[] = await screen.findAllByRole("button", {name: /\+/i});



    console.log(minusButtons);
    console.log(plusButtons);



})