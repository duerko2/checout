import React, {FormEvent, useEffect, useState} from "react";
import {Item, Zipcode} from "./types";
import {getTotal} from "./OrderUtilityFunctions";
import {Register} from "./UserAuthentication";
import App from "./App";
import {UserResponse} from "@descope/web-js-sdk";
type UserFormProps = {
    isSignUp: boolean,
}
export function RegisterForm(){
    return (<div className="SignInForm">
        <ul>
            <li key="email">
                <label htmlFor="email">E-mail: </label>
                <input role="text" type="email" id="email" name="email" placeholder="eksempel@eksempel.dk"
                       required={true}/>
            </li>
            <li key="password">
                <label htmlFor="password">password:
                    <input type="password" id="password" name="password" placeholder="Password" required={true}/>
                </label>
            </li>
            <li className="registerbutton" key="submit">
                <button type="submit" name="submit">Register</button>
            </li>
            <li className="signinbutton">
                <p>Already registered? <a href="/?page=login">Log in</a></p>
            </li>
        </ul>
    </div>)
}
export function SignInForm(){
    return (<div className="SignInForm">
        <ul>
            <li key="email">
                <label htmlFor="email">E-mail: </label>
                <input role="text" type="email" id="email" name="email" placeholder="eksempel@eksempel.dk"
                       required={true}/>
            </li>
            <li key="password">
                <label htmlFor="password">password:
                    <input type="password" id="password" name="password" placeholder="Password" required={true}/>
                </label>
            </li>
            <li className="signinbutton" key="submit">
                <button type="submit" name="submit">Log In</button>
            </li>
            <li className="registerbutton">
                <p>Not registered? <a href="/?page=login">Create a user</a></p>
            </li>
        </ul>
    </div>)
}


export function UserForm({isSignUp}: UserFormProps) {


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
    function checkBillingZip(inputZip: string) {
        if (inputZip === "") {
            setBillingZipVisible(false);
            setBillingCityText("");
        } else {
            for (let zipcode of zipcodes) {
                if (inputZip === zipcode.nr) {
                    setBillingCityText(zipcode.navn);
                    setBillingZipVisible(false);
                    break;
                } else {
                    setBillingZipVisible(true);
                    setBillingCityText("");
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

        fetchZip();
    }, []);


    return (<div className="Form">
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
                           title="Please enter valid phone number"/>
                </li>
                <li key="email">
                    <label htmlFor="email">E-mail: </label>
                    <input role="text" type="email" id="email" name="email" placeholder="eksempel@eksempel.dk"
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
                               pattern="[0-9]{4}" required={true}/>
                    </label>
                    <p id="validZip" style={{display: zipVisible ? "block" : "none"}}>Not a valid zip</p>
                </li>
                <li key="city">
                    <label htmlFor="city">City:
                        <input type="text" id="city" name="city" placeholder="City" readOnly={true} required={true}
                               value={cityText.valueOf()}/>
                    </label>
                </li>

                <li>
                    <label htmlFor="Company Name">Company:
                        <input type="text" id="company" name="company" placeholder="Company"/>
                    </label>
                </li>
                <li key="vat">
                    <label htmlFor="VAT">VAT:
                        <input type="text" id="vat" name="vat" placeholder="00000000" pattern={"[0-9]{8}"}/>
                    </label>
                </li>
                { !isSignUp &&(
                <li className="accept-condition" key="seperateBilling">
                    <label htmlFor="separateBilling">
                        <input type="checkbox" id="checkbox" name="separateBilling"
                               onChange={() => setSeparateBilling(!separateBilling)}/>
                        Separate Billing Address: </label>
                </li>
                )}
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
                            <input type="text" id="billingPhone" name="billingPhone" pattern="\+{1}[0-9]{10}|[0-9]{8}"
                                   placeholder="0000000" required={separateBilling}
                                   title="Please enter valid phone number"/>
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
                                   pattern="[0-9]{4}" required={separateBilling}/>
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
                { !isSignUp &&(
                <li className="accept-condition" key="marketingEmails">
                    <label htmlFor="marketingEmails">
                        <input name="marketingEmails" type="checkbox" id="checkbox"/>
                        I accept to receive marketing emails</label>
                </li>
                )}
                { !isSignUp &&(
                <li key="comment">
                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" rows={4}>
        </textarea>
                </li>
                    )}

                <li className="button" key="submit">
                    <button type="submit" name="submit">Continue</button>
                </li>
            </ul>
    </div>)

}