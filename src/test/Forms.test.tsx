import {render, fireEvent, waitFor, screen} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {Component, HTMLInputTypeAttribute} from "react";
import userEvent from '@testing-library/user-event'
import {Delivery} from "../Delivery";
import App from "../App";
import{beforeAll,afterAll,afterEach} from "vitest";

import server from "../mocks/server";
import {RequestHandler, rest, restContext, RestHandler} from "msw";

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
        fireEvent.change(input, { target: { value: "test address\n2nd line" } });
        expect(input).toHaveValue("test address\n2nd line");



    })

    test("zip og city input", async () => {
        setup(<App/>)
        const zipInput: HTMLInputElement = screen.getByRole("textbox", {name: /zip/i});
        const cityInput: HTMLInputElement = screen.getByRole("textbox", {name: /city/i});

        await new Promise(r => setTimeout(r, 1000));

        // Test readonly
        expect(cityInput).toHaveAttribute("readonly");
        fireEvent.change(cityInput, { target: { value: "test city" } });
        expect(cityInput).toHaveValue("");

        // Test empty input
        expect(zipInput).toHaveValue("");
        expect(cityInput).toHaveValue("");
        expect(zipInput).toBeInvalid();

        // Test invalid input
        fireEvent.change(zipInput, { target: { value: "1500" } });
        expect(zipInput).toHaveValue("1500");
        expect(screen.getByText("Not a valid zip")).toBeInTheDocument();
        expect(cityInput).toHaveValue("");

        // Test valid input
        fireEvent.change(zipInput, {target: {value: "1555"}});
        expect(zipInput).toHaveValue("1555");
        expect(cityInput).toHaveValue("København V");


    },10000)



    test("submit button", async () => {

        // NOT DONE
        setup(<App/>)

        const submitButton = screen.getByText("Go to payment")



        fireEvent.change(screen.getByRole("textbox", { name: /name/i }), { target: { value: "testName" } });
        fireEvent.change(screen.getByRole("textbox", { name: /Phone:/i }), { target: { value: "31345678" } });
        expect(screen.getByRole("textbox", { name: /phone/i })).toHaveValue("31345678");
        fireEvent.change(screen.getByRole("text", {name:/E-mail:/i}), { target: { value: "test@tester.dk" } });
        fireEvent.change(screen.getByRole("textbox", { name: /address/i }), { target: { value: "test address" } });
        await new Promise(r => setTimeout(r, 500));
        fireEvent.change(await screen.findByRole("textbox", {name: /zip/i}), {target: {value: "1555"}});
        await new Promise(r => setTimeout(r, 500));
        //fireEvent.click(screen.getByRole("checkbox",{name:/termsConditions/i}));
        //expect(screen.getByRole("checkbox",{name:/I accept terms & conditions/i})).toBeChecked();

        await new Promise(r => setTimeout(r, 500));
        //fireEvent.click(submitButton);

    })


})