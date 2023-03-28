import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import {describe, expect, it, test, vi} from "vitest";
import React, {FormEvent} from "react";
import userEvent from '@testing-library/user-event'
import App from "../App";
/*
import{beforeAll,afterAll,afterEach} from "vitest";
import server from "../mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


 */

function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

describe("APIs", () => {
    test("submit button api call",  async() => {

        // NOT DONE
        const {user} = setup(<App/>)

        const submitButton = screen.getByRole('button', {name: /Go To Payment/i});

        const pipedreamURL = "https://eoyy8shk0uki1al.m.pipedream.net/";

        const mockFetch = vi.spyOn(window, 'fetch');


        await user.type(screen.getByRole("textbox", {name: /name/i}), "Marcus Jacobsen");
        await user.type(screen.getByRole("textbox", {name: /phone/i}), "+4531729624");
        expect(screen.getByRole("textbox", {name: /phone/i})).toHaveValue("+4531729624");
        await user.type(screen.getByRole("text", {name: /E-mail:/i}), "marcusjacobsen1995@gmail.com");
        await user.type(screen.getByRole("textbox", {name: /address/i}), "Peter Bangs Vej 177A\n2 TV");
        await new Promise(r => setTimeout(r, 500));
        await user.type(screen.getByRole("textbox", {name: /zip/i}), "2500");
        await user.click(screen.getByRole("checkbox", {name: /termsConditions/i}))
        expect(screen.getByRole("checkbox", {name: /termsConditions/i})).toBeChecked();

        await new Promise(r => setTimeout(r, 500));
        const form : HTMLFormElement= screen.getByRole("form", {name: /deliveryForm/i});
        fireEvent.submit(form);


        //expect(mockFetch).toHaveBeenCalledWith(pipedreamURL,{"delivery":{"name":"Marcus Jacobsen","phone":"+4531729624","email":"marcusjacobsen1995@gmail.com","address":"Peter Bangs Vej 177A\n2 TV","zip":"2500","city":"Valby","country":"Denmark","company":""},"separateBilling":false,"billing":{"billingAddress":"","billingCity":"","billingCountry":"Denmark","billingEmail":"","billingName":"","billingPhone":"","billingVAT":"","billingZip":""},"comment":"","termsAndConditions":true,"marketingEmails":false,"order":{"itemList":[{"product":{"id":"vitamin-c-500-250","name":"C-vitamin, 500mg, 250 stk","price":150,"currency":"DKK","rebateQuantity":2,"rebatePercent":25,"upsellProductId":"vitamin-c-depot-500-250"},"quantity":1,"giftWrap":false},{"product":{"id":"trimmer","name":"Barbermaskine","price":200,"currency":"DKK","rebateQuantity":0,"rebatePercent":0,"upsellProductId":"trimmer-battery"},"quantity":1,"giftWrap":false},{"product":{"id":"coffeebeans-500g","name":"Kaffebønner","price":50,"currency":"DKK","rebateQuantity":4,"rebatePercent":25,"upsellProductId":"coffeebeans-organic-500g"},"quantity":1,"giftWrap":false}],"recurring":false},"totalPrice":360});
    })
})