import { render, screen } from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React from "react";
import userEvent from '@testing-library/user-event'
import App from "../App";


function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

test('plus-minus item units', async () => {
    const {user} = setup(<App/>)


    const minusButtons:HTMLElement[] = await screen.findAllByRole("button", {name: /-/i});
    const plusButtons:HTMLElement[] = await screen.findAllByRole("button", {name: /\+/i});

    let units:HTMLParagraphElement[] = await screen.findAllByTitle("units");

    // Test plus button
    expect(units[0].textContent).toBe("1");
    await user.click(plusButtons[0]);
    expect(units[0].textContent).toBe("2");

    // Test minus
    await user.click(minusButtons[0]);
    await user.click(minusButtons[0]);
    expect(units[0].textContent).toBe("0");

    // Test min value for units (0)
    await user.click(minusButtons[0]);
    expect(units[0].textContent).toBe("0");

    // test max value for units (100)
    for (let i = 0; i < 102; i++) {
        await user.click(plusButtons[0]);
    }
    expect(units[0].textContent).toBe("100");



})