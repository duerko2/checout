import { render, screen } from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {HTMLInputTypeAttribute} from "react";
import userEvent from '@testing-library/user-event'
import {Delivery} from "../Delivery";
import App from "../App";

function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

describe(Delivery.name, () => {
    test('plus-minus item units', async () => {
        setup(<App/>)


        const paymentButton: HTMLInputElement[] = await screen.findAllByTitle("name");
        // const forms: HTMLElement[] = await screen.findAllByRole("forms", {name: "Go to payment"});
        const nameForm: HTMLFormElement[] = await screen.findByLabelText("name");

        expect()

    })
})