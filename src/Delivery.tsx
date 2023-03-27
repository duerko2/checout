import {Item, Order, Product, Zipcode, PurchaseInfo} from "./types";
import React, {FormEvent, useState} from "react";
import {Basket} from "./Basket";
import {getAllByLabelText} from "@testing-library/react";


let zipcodes: Array<Zipcode>;

/**
 * TODO mangler onClick i submit knappen, for at kunne validere zipcode med checkZip for at gå videre
 * @constructor
 */
export function Delivery({order,setOrder}:{order:{itemList:Item[],recurring:boolean},setOrder:(order:{itemList:Item[],recurring:boolean})=>void}) {
    const [separateBilling, setSeparateBilling] = useState<Boolean>(false);
    const [cityText, setCityText] = useState<String>("");
    const [zipVisible, setZipVisible] = useState<Boolean>(false);

    function checkZip(Inputzip: string) {
            if (Inputzip === "") {
                setZipVisible(false);
            } else {
                for (var zipcode of zipcodes) {
                    if (Inputzip === zipcode.nr) {
                        setCityText(zipcode.navn);
                        setZipVisible(false);
                        break;
                    } else {
                        setZipVisible(true);
                    }
                }
            }
    }
    fetchZip();

    async function fetchZip() {
        const URL = "https://api.dataforsyningen.dk/postnumre";
        try {
            const response = await fetch(URL);
            const result = (await response.json()) as Zipcode[];
            zipcodes = result;
        } catch (e) {
            console.log(e)
        }
    }



    async function postOrder() {
        const URL = "https://eowdxi3ymnvlrmg.m.pipedream.net"
        await fetch(URL, {
            method: "POST", headers: {"content-type": "application/Json"}, body: JSON.stringify(purchaseInfo)
        });
    }

    const [purchaseInfo] = useState<PurchaseInfo>({
        VAT: "",
        address: "",
        billingAddress: "",
        billingCity: "",
        billingCompany: "",
        billingCountry: "",
        billingEmail: "",
        billingName: "",
        billingPhone: "",
        billingVAT: "",
        billingZip: "",
        city: "",
        comment: "",
        company: "",
        country: "",
        email: "",
        marketingEmails: false,
        name: "",
        order: order,
        phone: "",
        price: 0,
        termsAndConditions: false,
        zip: ""
    })





    return (<div className="delivery-form">
        <form>
            <h3>Delivery information</h3>
            <ul>
                <li>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" name="name" placeholder="Name" required={true}/>
                </li>
                <li>
                    <label htmlFor="phone">Phone: </label>
                    <input type="text" id="phone" name="phone" pattern="[0-9]{8}" placeholder="0000000" required={true}
                           title="Please enter valid phone number"/>
                </li>
                <li>
                    <label htmlFor="email">E-mail: </label>
                    <input role="text" type="email" id="email" name="email" placeholder="eksempel@eksempel.dk" required={true}/>
                </li>
                <li>
                    <label htmlFor="address">Address: </label>
                    <input type="text" id="address" name="address" placeholder="Address" required={true}/>
                    <input type="text" id="address" name="address" placeholder="Address 2nd line "/>
                </li>
                <li>
                    <label htmlFor="zip">Zip: </label>
                    <input type="text" id="zip" name="zip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                           pattern="[0-9]{4}" required={true}/>
                    <label id="validZip" style={{display: zipVisible ? "block" : "none"}}>Ikke en zip</label>
                </li>
                <li>
                    <label htmlFor="city">City: </label>
                    <input type="text" id="city" name="city" placeholder="City" readOnly={true} required={true} value={cityText.valueOf()}/>
                </li>
                <li>
                    <label htmlFor="country">Country: </label>
                    <input type="text" id="country" name="country" value="Denmark" readOnly={true} required={true}/>
                </li>
                <li>
                    <label htmlFor="Company Name">Company: </label>
                    <input type="text" id="company" name="company" placeholder="Company"/>
                </li>
                <li>
                    <label htmlFor="VAT">VAT: </label>
                    <input type="text" id="vat" name="vat" placeholder="00000000" pattern={"[0-9]{8}"}/>
                </li>
                <li className="accept-condition">
                    <input type="checkbox" id="checkbox" onChange={()=>setSeparateBilling(!separateBilling)}/>
                    <label htmlFor="seperatebilling">Seperate Billing Address: </label>
                </li>
                <div style={{display: separateBilling ? "block" : "none"}}>
                    <h3>Billing Address</h3>
                    <li>
                        <label htmlFor="billingname">Name: </label>
                        <input type="text" id="name" name="billingname" placeholder="Name" required={true}/>
                    </li>
                    <li>
                        <label htmlFor="billingphone">Phone: </label>
                        <input type="text" id="billingphone" name="billingphone" pattern="[0-9]{8}" placeholder="0000000" required={true} title="Please enter valid phone number"/>
                    </li>
                    <li>
                        <label htmlFor="billingemail">E-mail: </label>
                        <input type="email" id="billingemail" name="billingemail" placeholder="eksempel@eksempel.dk" required={true}/>
                    </li>
                    <li>
                        <label htmlFor="billingaddress">Address: </label>
                        <input type="text" id="address" name="billingaddress" placeholder="Address" required={true}/>
                        <input type="text" id="address" name="billingaddress" placeholder="Address 2nd line "/>
                    </li>
                    <li>
                        <label htmlFor="billingzip">Zip: </label>
                        <input type="text" id="zip" name="billingzip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                               pattern="[0-9]{4}" required={true}/>
                        <label id="validZip">Ikke en zip</label>
                    </li>
                    <li>
                        <label htmlFor="billingcity">City: </label>
                        <input type="text" id="city" name="billingcity" placeholder="City" readOnly={true} required={true}/>
                    </li>
                    <li>
                        <label htmlFor="billingcountry">Country: </label>
                        <input type="text" id="country" name="billingcountry" value="Denmark" readOnly={true} required={true}/>
                    </li>
                    <li>
                        <label htmlFor="billingCompanyName">Company: </label>
                        <input type="text" id="company" name="billingCompanyName" placeholder="Company"/>
                    </li>
                    <li>
                        <label htmlFor="BillingVAT">VAT: </label>
                        <input type="text" id="vat" name="BillingVAT" placeholder="00000000" pattern={"[0-9]{8}"}/>
                    </li>
                </div>
                <li className="accept-condition" style={{marginTop: "1em"}}>
                    <input name="terms&conditions" type="checkbox" id="checkbox" required={true}/>
                    <label htmlFor="terms&conditions">I accept terms & conditions</label>
                </li>
                <li className="accept-condition">
                    <input name="marketingemails" type="checkbox" id="checkbox"/>
                    <label htmlFor="marketingemails">I accept to receive marketing emails</label>
                </li>
                <li>
                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" rows={4}>
                    </textarea>
                </li>

                <li className="button">
                    <button type="submit" onClick={postOrder}>Go to payment</button>
                </li>
            </ul>
        </form>
    </div>)
}