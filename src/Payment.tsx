import {OrderInfo} from "./types";
import {FormEvent, useState} from "react";
import "./styles/Delivery.css";


export function Payment({orderInfo}: { orderInfo: OrderInfo }) {
    const [submitted, setSubmitted] = useState<boolean>(false);

    async function submitOrder(e: FormEvent) {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            cardNumber: { value: string };
            expirationDate: { value: string };
            securityCode: { value: string };
        }
        const paymentInformation = {
            type: "card",
            info: {
                cardNumber: target.cardNumber.value,
                expirationDate: target.expirationDate.value,
                securityCode: target.securityCode.value
            },
        }
        const body = JSON.stringify({paymentInformation: paymentInformation, orderInfo: orderInfo});

        const URL = "https://eoyy8shk0uki1al.m.pipedream.net/"
        const response = await fetch(URL, {
            method: "POST", headers: {"content-type": "application/Json"}, body: body
        });
        console.log(response);


        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div>
                <h2>Thank you for your order!</h2>
            </div>
        )
    } else return (

        <div className="right-side-form">
            <div>
                <h2>Payment</h2>
            </div>
            <div>
                <form aria-label="paymentForm" name="delivery" onSubmit={submitOrder}>
                    <ul>
                        <li key="cardNumber">
                            <label htmlFor="cardNumber">
                                Card number:
                                <input type="card" name="cardNumber" placeholder="1234-1234-1234-1234" required={true} pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                                       title="Please enter valid card number, make sure that after each 4 numbers there is hyphen ('-')."/>
                            </label>
                        </li>
                        <li key="expirationDate">
                            <label htmlFor="expirationDate">
                                Expiration date:
                                <input type="text" name="expirationDate" placeholder="01-01" required={true} pattern="(0[1-9]|1[0-2])-(2[3-9]|[3-9][0-9])"
                                       title="Please enter valid expiration date, make sure that between month and year that there is hyphen ('-')."/>
                            </label>
                        </li>
                        <li key="securityCode">
                            <label htmlFor="securityCode">
                                Security code:
                                <input type="text" name="securityCode" placeholder="123" required={true} pattern="[0-9]{3}"/>
                            </label>
                        </li>
                        <li className="button" key="submit">
                            <button type="submit" value="Submit">Submit order</button>
                        </li>
                    </ul>
                </form>
            </div>
        </div>


    )
}