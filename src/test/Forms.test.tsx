import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {Component, HTMLInputTypeAttribute} from "react";
import userEvent from '@testing-library/user-event'
import {Delivery} from "../Delivery";
import App from "../App";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

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


})