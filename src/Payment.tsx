import {OrderInfo} from "./types";
import {FormEvent, useState} from "react";




export function Payment({orderInfo}: {orderInfo:OrderInfo}) {
    const [submitted,setSubmitted] = useState<boolean>(false);

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
        const body = JSON.stringify({paymentInformation:paymentInformation,orderInfo:orderInfo});

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
            <form onSubmit={submitOrder}>
                <ul>
                    <li>
                <label htmlFor="cardNumber">
                    Card number:
                    <input type="card" name="cardNumber" required={true} pattern="[0-9]{16}" />
                </label>
                    </li>
                    <li>
                <label htmlFor="expirationDate">
                    Expiration date:
                    <input type="text" name="expirationDate" required={true}/>
                </label>
                    </li>
                        <li>
                <label htmlFor="securityCode">
                    Security code:
                    <input type="text" name="securityCode" required={true} pattern="[0-9]{3}" />
                </label>
                        </li>
                    <li className="button">
                        <button type="submit" value="Submit">Submit order</button>
                    </li>
                </ul>
            </form>
        </div>
        </div>


    )
}