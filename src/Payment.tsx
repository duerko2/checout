import {OrderInfo} from "./types";
import React, {FormEvent, useState} from "react";
import "./styles/Delivery.css";


export function Payment({orderInfo}: { orderInfo: OrderInfo }) {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<boolean>(false);
    const [expirationDateValid, setExpirationDateValid] = useState<boolean>(false);
    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(2));
    const currentMonth = currentDate.getMonth() + 1;
    const [expVisible, setExpVisible] = useState<Boolean>(false);

    function isValidExpirationDate(expirationDate: string): boolean {
        if (expirationDate === "") {
            setExpVisible(false);
        }

        const regex = /^([0-9]{2})-([0-9]{2})$/;
        let [month, year] = expirationDate.split("-");

        if (!regex.test(expirationDate)) {
            setExpVisible(true);
            return false;
        }

        if (month.startsWith("0")) {
            month = month.slice(1);
        }

        if (Number(month) < 1 || Number(month) > 12) {
            setExpVisible(true);
            return false;
        }

        if (Number(year) < currentYear) {
            setExpVisible(true);
            return false;
        }

        if (Number(year) === currentYear && Number(month) < currentMonth) {
            setExpVisible(true);
            return false;
        }

        setExpVisible(false);
        return true;
    }

    async function submitOrder(e: FormEvent) {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            cardNumber: { value: string };
            expirationDate: { value: string };
            securityCode: { value: string };
        }

        const expirationDate = target.expirationDate.value;
        if (!isValidExpirationDate(expirationDate)) {
            setExpirationDateValid(false);
            return;
        }
        setExpirationDateValid(true);

        const paymentInformation = {
            type: "card",
            info: {
                cardNumber: target.cardNumber.value,
                expirationDate: target.expirationDate.value,
                securityCode: target.securityCode.value
            },
        }

        const body = JSON.stringify({paymentInformation: paymentInformation, orderInfo: orderInfo});

        try {
            const URL = "https://eoyy8shk0uki1al.m.pipedream.nt/"
            const response = await fetch(URL, {
                method: "POST", headers: {"content-type": "application/Json"}, body: body
            });
            console.log(response);
            setSubmitted(true);
        } catch (e) {
            setPaymentError(true);
        }
    }
    if(paymentError){
        return (
            <div>
                <h2>Something went wrong with your payment. Please go back and try again.</h2>
            </div>
        )
    } else if (submitted) {
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
                                       title="Please enter valid card number, make sure that after each 4 digits there is hyphen ('-') besides the last set."/>
                            </label>
                        </li>
                        <li key="expirationDate">
                            <label htmlFor="expirationDate">
                                Expiration date:
                                <input type="text" name="expirationDate" placeholder="MM-YY" required={true}
                                       pattern="(0[1-9]|1[0-2])-([0-9]{2})"
                                       title="Please enter valid expiration date, make sure that between month and year that there is hyphen ('-')."
                                       onChange={(e) => setExpirationDateValid(isValidExpirationDate(e.target.value))}
                                />
                            </label>
                            <p id="validZip" style={{display: expVisible ? "block" : "none"}}>Not a valid expiration date</p>
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