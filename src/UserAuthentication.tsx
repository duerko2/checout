//export function signUp
import React, {FormEvent, useState} from "react";
import {RegisterForm, SignInForm, UserForm} from "./UserForm";
import {User} from "./types";
import {expect} from "vitest";

import DescopeSdk from "@descope/web-js-sdk";
import Any = jasmine.Any;

/*try {
    //  baseUrl="<URL>" // you can also configure the baseUrl ex: https://auth.company.com - this is useful when you utilize CNAME within your Descope project.

} catch (error) {
    // handle the error
    console.log("failed to initialize: " + error)
}*/
export function LogIn(
    {navigateBack, setSignUpInfo}:{ navigateBack: () => void, setSignUpInfo: (userInfo: User)=> void }
){
    const descopeSdk = DescopeSdk({ projectId: 'P2PAX7V2d2itZjlitQL5JWmcwgUo' });
    async function loginUser(e: FormEvent){
        e.preventDefault();

        const target = e.target as typeof e.target & {
            email: { value: string };
            password: {value: string };
        }

        // Args:
//    loginId (str): The login ID of the user being signed in
        const loginId =target.email.value;
//    password (str): The user's password
        const password = target.password.value;

        const resp = await descopeSdk.password.signIn(loginId, password);
        if (!resp.ok) {
            console.log("Failed to sign in via password")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error?.errorCode)
            console.log("Error Description: " + resp.error?.errorDescription)
        }
        else {
            console.log("Successfully signed in via password")
            console.log(resp);
        }
    }


    return (<div className="login-form">
        <form aria-label="loginForm" name="login" onSubmit={loginUser}>
            <h3>Sign up</h3>
            <SignInForm/>
        </form>
    </div>)
}

export function Register({navigateBack, setSignUpInfo
}:
                           { navigateBack: () => void, setSignUpInfo: (userInfo: User)=> void }) {

    const [requesting, setRequesting] = useState(false)

    const descopeSdk = DescopeSdk({ projectId: 'P2PAX7V2d2itZjlitQL5JWmcwgUo' });



    async function createUser(e: FormEvent) {
        e.preventDefault();

        // Args:
        //    loginId (str): The login ID of the user being signed up
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: {value: string };
        }

        // Args:
        //    loginId (str): The login ID of the user being signed in
        const loginId =target.email.value;
        //    password (str): The user's password
        const password = target.password.value;
        //    user (dict) optional: Preserve additional user metadata in the form of
        const user = { "name": "Joe Biden", "phone": "+15555555555", "email": "email@company.com"}

        const resp = await descopeSdk.password.signUp(loginId, password, user);
        if (!resp.ok) {
            console.log("Failed to sign up via password")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error?.errorCode)
            console.log("Error Description: " + resp.error?.errorDescription)
        }
        else {
            console.log("Successfully signed up via password")
            console.log(resp);
        }


    }

    return (<div className="sign-up-form">
        <form aria-label="signUpForm" name="signUp" onSubmit={createUser}>
            <h3>Sign up</h3>
            <RegisterForm />
        </form>
    </div>)
}
