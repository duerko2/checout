import {render, fireEvent, waitFor, screen, cleanup} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React from "react";
import userEvent from '@testing-library/user-event'
import {Delivery} from "../Delivery";
import App from "../App";
import{beforeAll,afterAll,afterEach} from "vitest";

import server from "../mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}


describe(Delivery.name, () => {
    test('name validation test', async () => {
        setup(<App/>)

        const input = screen.getByRole("textbox", { name: /name/i });
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: "test" } });
        expect(input).toHaveValue("test");
        cleanup();
        })
    test('phone validation test', async () =>{
        setup(<App/>)
        const input = screen.getByRole("textbox", { name: /phone/i });
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: "1234567" } });
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: "12345678" } });
        expect(input).toHaveValue("12345678");
        expect(input).toBeValid();
        cleanup();
    })
    test('e-mail validation test', async () =>{
        setup(<App/>)
        const input = screen.getByRole("text", {name:/E-mail:/i});
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: "Hej" } });
        expect(input).toHaveValue("Hej");
        expect(input).toBeInvalid();
        fireEvent.change(input, { target: { value: "Hej@med.dig" } });
        expect(input).toHaveValue("Hej@med.dig");
        expect(input).toBeValid();
        cleanup();
    })



    test("address form validation", async () => {
        setup(<App/>)

        const input : HTMLInputElement = screen.getByRole("textbox", { name: /address/i });

        // Test empty input
        expect(input).toHaveValue("");
        expect(input).toBeInvalid();

        // Test valid input
        fireEvent.change(input, { target: { value: "test address" } });
        expect(input).toHaveValue("test address");

        // Allow multiple line
        fireEvent.change(input, { target: { value: "test address 2" } });
        expect(input).toHaveValue("test address\n2nd line");
        cleanup();
    })

    test("zip og city input", async () => {
        const {user} = setup(<App/>)
        const zipInput = screen.getByRole("textbox", {name: /zip/i});
        const cityInput: HTMLInputElement = screen.getByRole("textbox", {name: /city/i});

        await new Promise(r => setTimeout(r, 1000));

        // Test readonly
        expect(cityInput).toHaveAttribute("readonly");
        user.type(cityInput, "test city");
        expect(cityInput).toHaveValue("");

        // Test empty input
        expect(zipInput).toHaveValue("");
        expect(cityInput).toHaveValue("");
        expect(zipInput).toBeInvalid();

        // Test invalid input
        fireEvent.change(zipInput,{target: {value: "1500"}});
        expect(zipInput).toHaveValue("1500");
        expect(screen.getAllByText("Not a valid zip")[0]).toBeInTheDocument();
        expect(cityInput).toHaveValue("");

        // Test valid input
        fireEvent.change(zipInput, {target: {value: "1555"}});
        expect(zipInput).toHaveValue("1555");
        expect(cityInput).toHaveValue("København V");

        // Test remove input
        fireEvent.change(zipInput, {target: {value: ""}});
        expect(zipInput).toHaveValue("");
        expect(cityInput).toHaveValue("");
        cleanup();
    },10000)


    test("Go to Payment button", async () => {
        // NOT DONE
        const {user} = setup(<App/>)
        await new Promise(r => setTimeout(r, 500));

        await user.type(screen.getByRole("textbox", {name: /name/i}), "Marcus Jacobsen");
        await user.type(screen.getByRole("textbox", {name: /phone/i}), "+4531729624");
        expect(screen.getByRole("textbox", {name: /phone/i})).toHaveValue("+4531729624");
        await user.type(screen.getByRole("text", {name: /E-mail:/i}), "marcusjacobsen1995@gmail.com");
        await user.type(screen.getByRole("textbox", {name: /address/i}), "Peter Bangs Vej 177A\n2 TV");
        await user.type(screen.getByRole("textbox", {name: /zip/i}), "2500");
        await user.click(screen.getByRole("checkbox", {name: /termsConditions/i}))
        expect(screen.getByRole("checkbox", {name: /termsConditions/i})).toBeChecked();
/*
        const form : HTMLFormElement= screen.getByRole("form", {name: /deliveryForm/i});
        fireEvent.submit(form);
        await new Promise(r => setTimeout(r, 500));
        expect(screen.getByText("Payment")).toBeInTheDocument();

 */

    })
})