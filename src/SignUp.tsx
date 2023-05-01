//export function signUp
import React, {FormEvent, useState} from "react";
import {UserForm} from "./UserForm";
import {User} from "./types";
import {expect} from "vitest";
import DescopeSdk from "@descope/web-js-sdk"

import DescopeClient from '@descope/node-sdk';

const managementKey = "xxxx"

//const descopeClient = DescopeClient({ projectId: 'P2OsOvJpvyJyafR9xhs2sYc4PeLC', /*managementKey: managementKey */});






export function SignUp({navigateBack, setSignUpInfo
}:
                           { navigateBack: () => void, setSignUpInfo: (userInfo: User)=> void }) {






        //


    async function createUser(e: FormEvent) {
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
            VAT?: { value: string }
            termsAndConditions: { checked: boolean}


        }
        console.log(target.name)
        setSignUpInfo({
            name: target.name.value,
            phone: target.phone.value,
            email: target.email.value,
            country: target.country.value,
            address: target.address.value,
            zip: target.zip.value,
            termsAndConditions: target.termsAndConditions.checked


        })
        const resp =  DescopeClient.arguments.user.create(
            target.name.value,
            target.phone.value,
            target.email.value,
            target.country.value,
            target.address.value,
            target.zip.value,
            target.termsAndConditions.checked

        )
        if (!resp.ok) {
            console.log("Failed to create user.")
            console.log("Status Code: " + resp.code)
            console.log("Error Code: " + resp.error.errorCode)
            console.log("Error Description: " + resp.error.errorDescription)
            console.log("Error Message: " + resp.error.message)
        } else {
            console.log("Successfully created user.")
            console.log(resp.data)
        }


        navigateBack()


    }

    return (<div className="sign-up-form">
        <form aria-label="signUpForm" name="signUp" onSubmit={createUser}>
            <h3>Sign up</h3>
            <UserForm isSignUp={true}/>
        </form>
    </div>)
}
