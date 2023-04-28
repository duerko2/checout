import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {HTMLInputTypeAttribute} from "react";
import userEvent from '@testing-library/user-event'
import App from "../App";
import {Basket} from "../Basket";
import {BasketGrid} from "../BasketGrid";



import{beforeAll,afterAll,afterEach} from "vitest";
import {Item} from "../types";
function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}
describe(Basket.name, () => {
    test('remove item when quantity 0', async () => {

        const {user} = setup(<App/>)
        await new Promise(r => setTimeout(r, 1000));

        const minusButtons: HTMLElement[] = await screen.findAllByRole("button", {name: /-/i});
        //HTMLElement[] = await screen.findAllByRole("button", {name: /-/i});
        const goToPayment: HTMLElement[] = await screen.findAllByRole("button", {name: /Go to payment/i});

        let units: HTMLParagraphElement[] = await screen.findAllByTitle("units");
        // Make the user wait for 5 seconds
        await new Promise(r => setTimeout(r, 2000));

        // Click minus on the first item
        await user.click(minusButtons[0]);
        // Click minus on the second item
        await user.click(minusButtons[1]);
        expect(units[0].textContent).toBe("0");
        expect(units[1].textContent).toBe("0");
        expect(units[2].textContent).toBe("1");

        // Insert name, phone, email, address, zip, city into the form and check the checkbox in order to go to payment
        const name = screen.getByRole("textbox", { name: /name/i });
        const input = screen.getByRole("textbox", { name: /phone/i });
        const email = screen.getByRole("text", {name:/E-mail:/i});
        const adr : HTMLInputElement = screen.getByRole("textbox", { name: /address/i });
        const zipInput = screen.getByRole("textbox", {name: /zip/i});
        fireEvent.change(zipInput, { target: { value: "2820" } });
        fireEvent.change(adr, { target: { value: "test address 2" } });
        fireEvent.change(email, { target: { value: "Hej@med.dig" } });
        fireEvent.change(input, { target: { value: "12345678" } });
        fireEvent.change(name, { target: { value: "test" } });
        const accept = screen.getByRole("checkbox", {name: /termsConditions/i});
        fireEvent.click(accept);
        // click go to payment
/*        await user.click(goToPayment[0]);

        await new Promise(r => setTimeout(r, 2000));
        const items: HTMLElement[] = (await screen.findAllByTitle("itemName"));
        expect(items.length).toBe(1);
        */

        cleanup();
    }, 20000)
})