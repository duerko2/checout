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
    const [separateBilling, setSeparateBilling] = useState<boolean>(false);
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
    function getTotal() {

        let total: number = 0;
        let total2: number = 0;
        order.itemList.forEach( p => {if(p.quantity>=p.product.rebateQuantity){ total += p.product.price * (1 - p.product.rebatePercent * (1 / 100)) * p.quantity}
        else {total += p.product.price * p.quantity;}
            total2=total
            if (total2 > 300) {
                total2 = total * 0.9;
            }
        })
        return total2;

    }



    async function postOrder(e: FormEvent) {
        e.preventDefault();
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
        console.log(e);
        console.log(target.name.value);



        const purchaseInfo = {
            name: target.name.value,
            phone: target.phone.value,
            email: target.email.value,
            address: target.address.value,
            zip: target.zip.value,
            city: target.city.value,
            country: target.country.value,
            company: target.company?.value,
            VAT: target.VAT?.value,
            comment: target.comment?.value,
            termsAndConditions: target.termsConditions.checked,
            marketingEmails: target.marketingEmails.checked,

            billingAddress: target.billingAddress?.value,
            billingCity: target.billingCity?.value,
            billingCompany: target.billingCompany?.value,
            billingCountry: target.billingCountry?.value,
            billingEmail: target.billingEmail?.value,
            billingName: target.billingName?.value,
            billingPhone: target.billingPhone?.value,
            billingVAT: target.billingVAT?.value,
            billingZip: target.billingZip?.value,
            order: order,
            totalPrice : getTotal()
        }


        const body=JSON.stringify(purchaseInfo);
        console.log(body);

        const URL = "https://eowdxi3ymnvlrmg.m.pipedream.net"
        const response = await fetch(URL, {
            method: "POST", headers: {"content-type": "application/Json"}, body: body
        });
        console.log(response);
        console.log(response.json())
    }





    return (<div className="delivery-form">
        <form onSubmit={postOrder}>
            <h3>Delivery information</h3>
            <ul>
                <li>
                    <label htmlFor="name">Name:
                    <input type="text" id="name" name="name" placeholder="Name" required={true}/>
                    </label>
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
                    <textarea name="address" aria-label="address" rows={2} required={true} placeholder="Address"></textarea>
                </li>
                <li>
                    <label htmlFor="zip">Zip: </label>
                    <input type="text" id="zip" name="zip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                           pattern="[0-9]{4}" required={true}/>
                    <label id="validZip" style={{display: zipVisible ? "block" : "none"}}>Not a valid zip</label>
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
                    <input type="checkbox" id="checkbox" name="separateBilling"onChange={()=>setSeparateBilling(!separateBilling)}/>
                    <label htmlFor="separateBilling">Seperate Billing Address: </label>
                </li>
                <div style={{display: separateBilling ? "block" : "none"}}>
                    <h3>Billing Address</h3>
                    <li>
                        <label htmlFor="billingName">Name: </label>
                        <input type="text" id="billingName" name="billingName" placeholder="Name" required={separateBilling}/>
                    </li>
                    <li>
                        <label htmlFor="billingPhone">Phone: </label>
                        <input type="text" id="billingPhone" name="billingPhone" pattern="[0-9]{8}" placeholder="0000000" required={separateBilling} title="Please enter valid phone number"/>
                    </li>
                    <li>
                        <label htmlFor="billingEmail">E-mail: </label>
                        <input type="email" id="billingEmail" name="billingEmail" placeholder="eksempel@eksempel.dk" required={separateBilling}/>
                    </li>
                    <li>
                        <label htmlFor="billingAddress">Address: </label>
                        <textarea name="billingAddress" aria-label="billingAddress" rows={2} required={separateBilling} placeholder="Address"></textarea>
                    </li>
                    <li>
                        <label htmlFor="billingZip">Zip: </label>
                        <input type="text" id="zip" name="billingzip" placeholder="Zip" onChange={(e) => checkZip(e.target.value)}
                               pattern="[0-9]{4}" required={separateBilling}/>
                        <label id="validZip">Ikke en zip</label>
                    </li>
                    <li>
                        <label htmlFor="billingCity">City: </label>
                        <input type="text" id="city" name="billingcity" placeholder="City" readOnly={true} required={separateBilling}/>
                    </li>
                    <li>
                        <label htmlFor="billingCountry">Country: </label>
                        <input type="text" id="country" name="billingcountry" value="Denmark" readOnly={true} required={separateBilling}/>
                    </li>
                    <li>
                        <label htmlFor="billingCompanyName">Company: </label>
                        <input type="text" id="company" name="billingCompanyName" placeholder="Company"/>
                    </li>
                    <li>
                        <label htmlFor="billingVAT">VAT: </label>
                        <input type="text" id="vat" name="billingVAT" placeholder="00000000" pattern={"[0-9]{8}"}/>
                    </li>
                </div>
                <li className="accept-condition" style={{marginTop: "1em"}}>
                    <label htmlFor="termsConditions">
                    <input name="termsConditions" type="checkbox" id="termsConditions" required={true}/>
                    I accept terms & conditions</label>
                </li>
                <li className="accept-condition">
                    <input name="marketingEmails" type="checkbox" id="marketingEmails"/>
                    <label htmlFor="marketingEmails">I accept to receive marketing emails</label>
                </li>
                <li>
                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" rows={4}>
                    </textarea>
                </li>

                <li className="button">
                    <button type="submit" name="submit">Go to payment</button>
                </li>
            </ul>
        </form>
    </div>)
}