//export function signUp
import React, {FormEvent, useState} from "react";
import {RegisterForm, SignInForm, UserForm} from "./UserForm";
import {User} from "./types";
import './styles/UserAuthentication.css';
import DescopeSdk, {UserResponse} from "@descope/web-js-sdk";


export function LogIn(
    {setUser, navigateBack}: { navigateBack: () => void, setUser: (user: UserResponse | undefined) => void }
) {
    const descopeSdk = DescopeSdk({projectId: 'P2PAX7V2d2itZjlitQL5JWmcwgUo'});

    async function loginUser(e: FormEvent) {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        }

        const loginId = target.email.value;
        const password = target.password.value;

        const resp = await descopeSdk.password.signIn(loginId, password);
        if (!resp.ok) {
            console.log("Failed to sign in via password")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error?.errorCode)
            console.log("Error Description: " + resp.error?.errorDescription)
        } else {
            setUser(resp.data?.user);
            navigateBack()
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

export function Register(
    {setUser, navigateBack}: { navigateBack: () => void, setUser: (user: UserResponse | undefined) => void }
) {

    const [requesting, setRequesting] = useState(false)

    const descopeSdk = DescopeSdk({projectId: 'P2PAX7V2d2itZjlitQL5JWmcwgUo'});


    async function createUser(e: FormEvent) {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        }


        const loginId = target.email.value;
        const password = target.password.value;
        const user = {"name": "Joe Biden", "phone": "+15555555555", "email": target.email.value}

        const resp = await descopeSdk.password.signUp(loginId, password, user);
        if (!resp.ok) {
            console.log("Failed to sign up via password")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error?.errorCode)
            console.log("Error Description: " + resp.error?.errorDescription)
        } else {
            setUser(resp.data?.user);
            navigateBack();
            console.log("Successfully signed up via password");
            console.log(resp);
        }


    }

    return (<div className="sign-up-form">
        <form aria-label="signUpForm" name="signUp" onSubmit={createUser}>
            <h3>Sign up</h3>
            <RegisterForm/>
        </form>
    </div>)
}
