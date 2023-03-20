import {Zipcode} from "./types";
import React from "react";


let zipcodes: Array<Zipcode>;

function checkZip(Inputzip: string) {
    var label = document.getElementById("validZip");
    var cityText = document.getElementById("city") as HTMLInputElement;
    if (label != null && cityText != null) {
        if (Inputzip === "") {
            label.style.display = "none";
        } else {
            for (var zipcode of zipcodes) {
                if (Inputzip === zipcode.nr) {
                    cityText.value = zipcode.navn;
                    label.style.display = "none";
                    break;
                } else {
                    label.style.display = "block";
                }
            }
        }
    }
}


/**
 * TODO mangler onClick i submit knappen, for at kunne validere zipcode med checkZip for at gå videre
 * @constructor
 */
export function Delivery() {
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

    function separateBilling() {

    }

    return (<div className="delivery-form">
        <form>
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
                    <label id="validZip">Ikke en zip</label>
                </li>
                <li>
                    <label key="city">City: </label>
                    <input type="text" id="city" name="city" placeholder="City" readOnly={true} required={true}/>
                </li>
                <li>
                    <label key="country">Country: </label>
                    <input type="text" id="country" name="country" value="Denmark" readOnly={true} required={true}/>
                </li>
                <li>
                    <label key="Company Name">Company: </label>
                    <input type="text" id="company" name="company" placeholder="Company"/>
                </li>
                <li>
                    <label key="VAT">VAT: </label>
                    <input type="text" id="vat" name="vat" placeholder="00000000" pattern={"[0-9]{8}"}/>
                </li>
                <li style={{display:"flex"}}>
                    <label key="seperatebilling">Seperate Billing Address: </label>
                    <input type="checkbox" id="checkbox" onChange={()=>separateBilling()}/>
                </li>
                <li className="button">
                    <button type="submit">Go to payment</button>
                </li>
            </ul>
        </form>
    </div>);
}