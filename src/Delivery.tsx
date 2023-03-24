import {Item, Order, Product, Zipcode} from "./types";
import React, {useState} from "react";
import {Basket} from "./Basket";


let zipcodes: Array<Zipcode>;
let cityName: String;
let zipVisible: String;


function checkZip(Inputzip: string) {
    var label = document.getElementById("validZip");
    var cityText = document.getElementById("city") as HTMLInputElement;
    if (cityText != null && label != null) {
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
export function Delivery({order,setOrder}:{order:{itemList:Item[],recurring:boolean},setOrder:(order:{itemList:Item[],recurring:boolean})=>void}) {
    const [separateBilling, setSeparateBilling] = useState<Boolean>(false);

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
            method: "POST", headers: {"content-type": "application/Json"}, body: JSON.stringify (order)});
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
                    <input type="text" id="tel" name="tel" pattern="[0-9]{8}" placeholder="0000000" required={true}
                           title="Please enter valid phone number"/>
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
                    <input type="checkbox" id="checkbox" onChange={()=>setSeparateBilling(!separateBilling)}/>
                    <label key="seperatebilling">Seperate Billing Address: </label>

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
                        <input type="text" id="city" name="billingcity" placeholder="City" readOnly={true} required={true}/>
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
                <li className="accept-condition">
                    <input type="checkbox" id="checkbox" required={true}/>
                    <label key="terms&conditions">I accept terms & conditions</label>
                </li>
                <li className="accept-condition">
                    <input type="checkbox" id="checkbox"/>
                    <label key="marketingemails">I accept to receive marketing emails</label>
                </li>
                <li>
                    <label key="comment">Comment</label>
                    <input type="text" id="comment"/>

                </li>

                <li className="button">
                    <button type="submit" onClick={postOrder}>Go to payment</button>
                </li>
            </ul>
        </form>
    </div>)
}