import {cleanup, render, screen} from "@testing-library/react";
import {describe, expect, it, test} from "vitest";
import React, {HTMLInputTypeAttribute} from "react";
import userEvent from '@testing-library/user-event'
import App from "../App";
import {Basket} from "../Basket";
import {b} from "vitest/dist/types-7cd96283";


function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

describe(Basket.name, () => {
    // Test remove item
    // This test works when run alone, but not when run together with all the others.
    test('remove item', async () => {

        const {user} = setup(<App/>)

        const allItems = await screen.findAllByTitle("itemName");
        expect(allItems).toHaveLength(3)
        screen.debug(allItems[0])
        screen.debug(allItems[1])
        screen.debug(allItems[2])
        const firstItem: HTMLElement = (allItems)[0];
        const firstItemName = firstItem.textContent;


        // Remove the first item
        await user.click((await screen.findAllByTitle("removeItem"))[0]);


        await new Promise(r => setTimeout(r, 1000));

        // Get all items
        const items: HTMLElement[] = (await screen.findAllByTitle("itemName"));
        console.log('------')
        screen.debug(items[0])
        screen.debug(items[1])
        screen.debug(items[2])
        console.log('------')
        expect(items).toHaveLength(2)

        // Check the item has been removed from the list of items now displayed.
        for (let item of items) {
            // expect(item).not.toBe(firstItem);
        }


        // minus buttons
        const removeButtons: HTMLInputElement[] = await screen.findAllByTitle("removeItem")

        // remove all items
        for (let i = 0; i < removeButtons.length; i++) {
            await user.click(removeButtons[0]);
        }
        await new Promise(r => setTimeout(r, 1000));

        expect(screen.getByText("Basket is empty")).toBeInTheDocument();

        // should state that there are no items in the basket
        cleanup();
    })


    test('plus-minus item units', async () => {
        const {user} = setup(<App/>)


        const minusButtons: HTMLElement[] = await screen.findAllByRole("button", {name: /-/i});
        const plusButtons: HTMLElement[] = await screen.findAllByRole("button", {name: /\+/i});

        let units: HTMLParagraphElement[] = await screen.findAllByTitle("units");

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
        cleanup();
    })

// test giftwrapped button
    test('giftwrapped button', async () => {
        const {user} = setup(<App/>)

        const giftwrappedButtons: HTMLInputElement[] = await screen.findAllByTitle("giftwrapped");

        expect(giftwrappedButtons[0].checked).toBe(false);
        await user.click(giftwrappedButtons[0]);
        expect(giftwrappedButtons[0].checked).toBe(true);
        cleanup()
    })



    // Test suggestions.
    test('suggestions') , async () => {
        const {user} = setup(<App/>)

        const suggestions = await screen.getAllByTitle("suggestion");

        // 3 suggestions show up
        expect(suggestions).toHaveLength(3);

        // Get first suggestion name
        const firstSuggestion = (await screen.getAllByTitle("suggestion"))[0];
        const firstSuggestionName = firstSuggestion.textContent;

        // click on a suggestion
        await user.click(firstSuggestion);

        // suggestion is added to basket
        const basket = await screen.findAllByTitle("itemName");

        let present:boolean = false;
        for(let item of basket) {
            if(item.textContent===firstSuggestionName){
                present = true;
            }
        }
        expect(present).toBe(true);
        cleanup()
    }
})
