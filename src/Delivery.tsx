import {Zipcode} from "./types";
import React, {useState} from "react";
import * as constants from "constants";


let zipcodes: Array<Zipcode>;

/**
 * TODO mangler onClick i submit knappen, for at kunne validere zipcode med checkZip for at gå videre
 * @constructor
 */
export function Delivery() {
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

    return (<div className="delivery-form">
        <form>
            <h3>Delivery information</h3>
            <ul>
                <li>
                    <label key="name">Name: </label>
                    <input type="text" id="name" name="name" placeholder="Name" required={true}/>
                </li>
                <li>
                    <label key="phone">Phone: </label>
                    <input type="text" id="tel" name="tel" pattern="[0-9]{8}" placeholder="0000000" required={true} title="Please enter valid phone number"/>
                </li>
                <li>
                    <label key="email">E-mail: </label>
                    <input type="email" id="email" name="email" placeholder="eksempel@eksempel.dk" required={true}/>
                </li>
                <li>
                    <label key="address">Address: </label>
                    <input type="text" id="address" name="address" placeholder="Address" required={true}/>
                    <input type="text" id="address" name="address" placeholder="Address 2nd line "/>
                </li>
                <li>
                    <label key="zip">Zip: </label>
                    <input type="text" id="zip" name="zip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                           pattern="[0-9]{4}" required={true}/>
                    <label id="validZip" style={{display: zipVisible ? "block" : "none"}}>Ikke en zip</label>
                </li>
                <li>
                    <label key="city">City: </label>
                    <input type="text" id="city" name="city" placeholder="City" readOnly={true} required={true} value={cityText.valueOf()}/>
                </li>
                <li>
                    <label key="country">Country: </label>
                    <input type="text" id="country" name="country" value="Denmark" readOnly={true} required={true}/>
                </li>
                <li>
                    <label key="Company Name">Company: </label>
                    <input type="text" id="company" name="company" placeholder="Company"/>
                </li>
                <li style={{display:"flex"}}>
                    <label key="seperatebilling">Seperate Billing Address: </label>
                    <input type="checkbox" id="checkbox" onChange={()=>setSeparateBilling(!separateBilling)}/>
                </li>
                <div style={{display: separateBilling ? "block" : "none"}}>
                    <h3>Billing Address</h3>
                    <li>
                        <label key="billingname">Name: </label>
                        <input type="text" id="name" name="billingname" placeholder="Name" required={true}/>
                    </li>
                    <li>
                        <label key="billingphone">Phone: </label>
                        <input type="text" id="tel" name="billingphone" pattern="[0-9]{8}" placeholder="0000000" required={true} title="Please enter valid phone number"/>
                    </li>
                    <li>
                        <label key="billingemail">E-mail: </label>
                        <input type="email" id="email" name="billingemail" placeholder="eksempel@eksempel.dk" required={true}/>
                    </li>
                    <li>
                        <label key="billingaddress">Address: </label>
                        <input type="text" id="address" name="billingaddress" placeholder="Address" required={true}/>
                        <input type="text" id="address" name="billingaddress" placeholder="Address 2nd line "/>
                    </li>
                    <li>
                        <label key="billingzip">Zip: </label>
                        <input type="text" id="zip" name="billingzip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                               pattern="[0-9]{4}" required={true}/>
                        <label id="validZip">Ikke en zip</label>
                    </li>
                    <li>
                        <label key="billingcity">City: </label>
                        <input type="text" id="city" name="billingcity" placeholder="City" readOnly={true} required={true}></input>
                    </li>
                    <li>
                        <label key="billingcountry">Country: </label>
                        <input type="text" id="country" name="billingcountry" value="Denmark" readOnly={true} required={true}/>
                    </li>
                    <li>
                        <label key="billingCompanyName">Company: </label>
                        <input type="text" id="company" name="billingCompanyName" placeholder="Company"/>
                    </li>
                    <li>
                        <label key="BillingVAT">VAT: </label>
                        <input type="text" id="vat" name="BillingVAT" placeholder="00000000" pattern={"[0-9]{8}"}/>
                    </li>
                </div>
                <li className="button">
                    <button type="submit">Go to payment</button>
                </li>
            </ul>
        </form>
    </div>);
}