import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React from "react";
import userEvent from '@testing-library/user-event'
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

describe("APIs", () => {
    it("submit button api call",  async() => {

        // NOT DONE
        setup(<App/>)

        const submitButton = screen.getByRole('button', {name: /Go To Payment/i});

        const form : HTMLFormElement= screen.getByRole("form", {name: /delivery/i});
        /*
        fireEvent.change(form, {formValues:{
            name: "testName",
            phone: "+4242424242",
            email: "test@tester.dk",
            address: "test address",
            zip: "1555",
        }});
        fireEvent.click(screen.getByRole("checkbox", {name: /termsConditions/i}));
        expect(screen.getByRole("checkbox", {name: /termsConditions/i})).toBeChecked();
        expect(screen.getByRole("textbox", {name: /phone/i})).toHaveValue("+4242424242");


        expect(form.checkValidity()).toBeTruthy()

         */



        await waitFor(() =>fireEvent.change(screen.getByRole("textbox", {name: /name/i}), {target: {value: "testName"}}));
        await waitFor(() =>fireEvent.change(screen.getByRole("textbox", {name: /phone/i}), {target: {value: "+4242424242"}}));
        expect(screen.getByRole("textbox", {name: /phone/i})).toHaveValue("+4242424242");
        await waitFor(() =>fireEvent.change(screen.getByRole("text", {name: /E-mail:/i}), {target: {value: "test@tester.dk"}}));
        await waitFor(() =>fireEvent.change(screen.getByRole("textbox", {name: /address/i}), {target: {value: "test address"}}));
        await new Promise(r => setTimeout(r, 1000));
        await waitFor(() =>fireEvent.change(screen.getByRole("textbox", {name: /zip/i}), {target: {value: "1555"}}));
        await waitFor(() => fireEvent.click(screen.getByRole("checkbox", {name: /termsConditions/i})));
        expect(screen.getByRole("checkbox", {name: /termsConditions/i})).toBeChecked();
        expect(screen.getByRole("textbox", {name: /phone/i})).toHaveValue("+4242424242");

        /*
        await waitFor(()=>form.requestSubmit(submitButton));

         */







    })
})