import { render, screen } from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {HTMLInputTypeAttribute} from "react";
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

// test giftwrapped button
test('giftwrapped button', async () => {
    const {user} = setup(<App/>)

    const giftwrappedButtons:HTMLInputElement[] = await screen.findAllByTitle("giftwrapped");

    expect(giftwrappedButtons[0].checked).toBe(false);
    await user.click(giftwrappedButtons[0]);
    expect(giftwrappedButtons[0].checked).toBe(true);

})

// Test remove item
test('remove item', async () => {
    const {user} = setup(<App/>)
    const firstItem:HTMLElement = (await screen.findAllByTitle("itemName"))[0];
    const firstItemName= firstItem.textContent;

    await user.click((await screen.findAllByTitle("removeItem"))[0]);

    const items:HTMLElement[] = (await screen.findAllByTitle("itemName"));


    // Check the item has been removed from the list of items now displayed.
    for(let item of items) {
        expect(item.textContent).not.toBe(firstItemName);
    }

    // minus buttons
    const minusButtons:HTMLInputElement[] = await screen.findAllByTitle("removeItem")

    // remove all items
    for (let i = 0; i < minusButtons.length ; i++) {
        await user.click(minusButtons[0]);
    }

    // should state that there are no items in the basket
    expect(screen.getByText("Basket is empty"
    )).toBeInTheDocument();
})
