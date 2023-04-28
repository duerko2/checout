//export function signUp

import React, {FormEvent} from "react";
import {UserForm} from "./UserForm";

export function SignUp() {


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
            VAT?: { value: string };
        }


        return (
            <div>
                <div className="signUo">
                    <h2>Sign up</h2>
                    <UserForm isSignUp={true}

                    />
                </div>
            </div>
        )
    }
}
