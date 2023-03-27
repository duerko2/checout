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
    test('Form validation test', async () => {
        setup(<App/>)

        const input = screen.getByRole("textbox", { name: /name/i });
        fireEvent.change(input, { target: { value: "test" } });
        expect(input).toHaveValue("test");




        })


})