import {Item, OrderInfo, Zipcode} from "./types";
import "./styles/Delivery.css";
import React, {FormEvent, useEffect, useState} from "react";
import {getTotal} from "./OrderUtilityFunctions";
import {UserForm} from "./UserForm";
import {BasketGrid} from "./BasketGrid";
import {f} from "msw/lib/glossary-de6278a9";


export function Delivery({
                             order,
                             setOrderInfo,
                             navigate
                         }: { order: { itemList: Item[], recurring: boolean }, setOrderInfo: (orderInfo: OrderInfo) => void, navigate: () => void }) {


    async function postOrder(e: FormEvent) {
        e.preventDefault();
        order.itemList.forEach(item => {
            removeItemWhenQuantityZero(item);
        });
        if (order.itemList.length === 0) {
            return;
        }

        const target = e.target as typeof e.target & {
            name: { value: string };
            phone: { value: string };
            email: { value: string };
            address: { value: string };
            zip: { value: string };
            city: { value: string };
            country: { value: string };
            company?: { value: string };
            VAT?: { value: string };
            separateBilling: { checked: boolean };
            comment?: { value: string };
            termsConditions: { checked: boolean };
            marketingEmails: { checked: boolean };
            billingAddress?: { value: string },
            billingCity?: { value: string },
            billingCompany?: { value: string },
            billingCountry?: { value: string },
            billingEmail?: { value: string },
            billingName?: { value: string },
            billingPhone?: { value: string },
            billingVAT?: { value: string },
            billingZip?: { value: string },
        }
        console.log(target.name.value);


        setOrderInfo({
            delivery: {
                name: target.name.value,
                phone: target.phone.value,
                email: target.email.value,
                address: target.address.value,
                zip: target.zip.value,
                city: target.city.value,
                country: target.country.value,
                company: target.company?.value ?? "",
                VAT: target.VAT?.value ?? "",
            },
            separateBilling: target.separateBilling.checked,
            billing: {
                address: target.billingAddress?.value ?? "",
                city: target.billingCity?.value ?? "",
                company: target.billingCompany?.value ?? "",
                country: target.billingCountry?.value ?? "",
                email: target.billingEmail?.value ?? "",
                name: target.billingName?.value ?? "",
                phone: target.billingPhone?.value ?? "",
                VAT: target.billingVAT?.value ?? "",
                zip: target.billingZip?.value ?? "",
            },
            comment: target.comment?.value ?? "",
            termsAndConditions: target.termsConditions.checked,
            marketingEmails: target.marketingEmails.checked,
            order: order,
            totalPrice: getTotal(order)
        });
        console.log(order);
        console.log("når vi hertil")
        navigate()
    }

    function removeItemWhenQuantityZero(item: Item) {
        if (item.quantity <= 0) {
            order.itemList = order.itemList.filter((i: Item) => i !== item);
        }
    }

    return (<div className="right-side-form">
        <form aria-label="deliveryForm" name="delivery" onSubmit={postOrder}>

            <h3>Delivery information</h3>
            <UserForm isSignUp={false}/>
        </form>
    </div>)
}


/*
    const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
    const [separateBilling, setSeparateBilling] = useState<boolean>(false);
    const [cityText, setCityText] = useState<String>("");
    const [billingCityText, setBillingCityText] = useState<String>("");
    const [zipVisible, setZipVisible] = useState<Boolean>(false);
    const [billingZipVisible, setBillingZipVisible] = useState<Boolean>(false);


    function checkZip(inputZip: string) {
        if (inputZip === "") {
            setZipVisible(false);
            setCityText("");
        } else {
            for (let zipcode of zipcodes) {
                if (inputZip === zipcode.nr) {
                    setCityText(zipcode.navn);
                    setZipVisible(false);
                    break;
                } else {
                    setZipVisible(true);
                    setCityText("");
                }
            }
        }
    }

    useEffect(() => {
        async function fetchZip() {
            const URL = "https://api.dataforsyningen.dk/postnumre";
            try {
                const response = await fetch(URL);
                const result = (await response.json()) as Zipcode[];
                setZipcodes(result)
            } catch (e) {
                console.log(e)
            }
        }

            <h3>Delivery information</h3>
            <ul>
                <li key="name">
                    <label htmlFor="name">Name:
                        <input type="text" id="name" name="name" placeholder="Name" required={true}/>
                    </label>
                </li>
                <li key="phone">
                    <label htmlFor="phone">Phone: </label>
                    <input type="text" id="phone" name="phone" pattern="((\+[0-9]{2}[0-9]{8}))|([0-9]{8})"
                           placeholder="00000000" required={true}
                           title="Must have 8 digits excluding country code if used (such as +45)"/>
                </li>
                <li key="email">
                    <label htmlFor="email">E-mail: </label>
                    <input role="text" type="email" id="email" name="email" placeholder="example@example.dk"

                           required={true}/>
                </li>
                <li key="country">
                    <label htmlFor="country">Country:
                        <input type="text" id="country" name="country" value="Denmark" readOnly={true} required={true}/>
                    </label>
                </li>
                <li>
                    <label htmlFor="address">Address: </label>
                    <textarea name="address" aria-label="address" rows={2} required={true}
                              placeholder="Address"></textarea>
                </li>
                <li key="zip">
                    <label htmlFor="zip">Zip:
                        <input type="text" id="zip" name="zip" placeholder="Zip"
                               onChange={(e) => checkZip(e.target.value)}
                               pattern="[0-9]{4}"
                               title="The zip code must have 4 digits."
                               required={true}
                        />

                    </label>
                    <p id="validZip" style={{display: zipVisible ? "block" : "none"}}>Not a valid zip</p>
                </li>
                <li key="city">
                    <label htmlFor="city">City:
                        <input type="text" id="city" name="city" placeholder="City" readOnly={true} required={true}
                               value={cityText.valueOf()}/>
                    </label>
                </li>
        fetchZip();
    }, []);


                <li>
                    <label htmlFor="Company Name">Company:
                        <input type="text" id="company" name="company" placeholder="Company"/>
                    </label>
                </li>
                <li key="vat">
                    <label htmlFor="VAT">VAT:
                        <input type="text" id="vat" name="vat" placeholder="00000000" pattern={"[0-9]{8}"}
                               title="Must have 8 digits."
                        />
                    </label>
                </li>
                <li className="accept-condition" key="seperateBilling">
                    <label htmlFor="separateBilling">
                        <input type="checkbox" id="checkbox" name="separateBilling"
                               onChange={() => setSeparateBilling(!separateBilling)}/>
                        Separate Billing Address: </label>
                </li>
                <div style={{display: separateBilling ? "block" : "none"}}>
                    <h3>Billing Address</h3>
                    <li key="billingName">
                        <label htmlFor="billingName">Name:
                            <input type="text" id="billingName" name="billingName" placeholder="Name"
                                   required={separateBilling}/>
                        </label>
                    </li>
                    <li key="billingPhone">
                        <label htmlFor="billingPhone">Phone:
                            <input type="text" id="billingPhone" name="billingPhone" pattern="((\+[0-9]{2}[0-9]{8}))|([0-9]{8})"
                                   placeholder="0000000" required={separateBilling}
                                   title="Must have 8 digits excluding country code if used (such as +45)"/>
                        </label>
                    </li>
                    <li key="billingEmail">
                        <label htmlFor="billingEmail">E-mail:
                            <input type="email" id="billingEmail" name="billingEmail" placeholder="eksempel@eksempel.dk"
                                   required={separateBilling}/>
                        </label>
                    </li>
                    <li key="billingCountry">
                        <label htmlFor="billingCountry">Country:
                            <input type="text" id="billingCountry" name="billingCountry" value="Denmark" readOnly={true}
                                   required={separateBilling}/>
                        </label>
                    </li>
                    <li key="billingAddress">
                        <label htmlFor="billingAddress">Address:
                            <textarea name="billingAddress" aria-label="billingAddress" rows={2}
                                      required={separateBilling} placeholder="Address"></textarea>
                        </label>
                    </li>
                    <li key="billingZip">
                        <label htmlFor="billingZip">Zip:
                            <input type="text" id="billingZip" name="billingZip" placeholder="Zip"
                                   onChange={(e) => checkBillingZip(e.target.value)}
                                   pattern="[0-9]{4}"
                                   title="The zip code must have 4 digits."
                                   required={separateBilling}/>
                        </label>
                        <p id="validZip" style={{display: billingZipVisible ? "block" : "none"}}>Not a valid zip</p>
                    </li>
                    <li key="billingCity">
                        <label htmlFor="billingCity">City:
                            <input type="text" id="billingCity" name="billingCity" placeholder="City" readOnly={true}
                                   required={separateBilling} value={billingCityText.valueOf()}/>
                        </label>
                    </li>
                    <li key="billingCompanyName">
                        <label htmlFor="billingCompanyName">Company:
                            <input type="text" id="company" name="billingCompanyName" placeholder="Company"/>
                        </label>
                    </li>
                    <li key="billingVAT">
                        <label htmlFor="billingVAT">VAT:
                            <input type="text" id="vat" name="billingVAT" placeholder="00000000"
                                   title="Must have 8 digits."
                                   pattern="\+{1}[0-9]{10}|[0-9]{8}"/>
                        </label>
                    </li>
                </div>
                <li className="accept-condition" style={{marginTop: "1em"}} key="termsConditions">
                    <label htmlFor="termsConditions">
                        <input name="termsConditions" aria-label="termsConditions" type="checkbox" id="checkbox"
                               required={true}/>
                        I accept terms & conditions</label>
                </li>
                <li className="accept-condition" key="marketingEmails">
                    <label htmlFor="marketingEmails">
                        <input name="marketingEmails" type="checkbox" id="checkbox"/>
                        I accept to receive marketing emails</label>
                </li>
                <li key="comment">
                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" rows={4}>
                    </textarea>
                </li>



                <li className="button" key="submit">
                    <button type="submit" name="submit">Go to payment</button>
                </li>
            </ul>
        </form>
    </div>)
}
*/