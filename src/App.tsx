import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import Spinner from "./assets/loading-gif.gif";
import {Address, Item, Order, OrderInfo, User,} from "./types";
import {Payment} from "./Payment";
import {PaymentBasket} from "./PaymentBasket";
import {LogIn, Register} from "./UserAuthentication";
import {UserForm} from "./UserForm";
import {UserResponse} from "@descope/web-js-sdk";

const emptyAddress: Address = {
    name: "",
    phone: "",
    email: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    company: "",
    VAT: ""
}

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState("delivery");
    const [navigating, setNavigating] = useState(true);
    const [order, setOrder] = useState<Order>({itemList: [], recurring: false});
    const [user, setUser] = useState<UserResponse | undefined>(undefined);
    const [orderInfo, setOrderInfo] = useState<OrderInfo>({
        delivery: emptyAddress,
        separateBilling: false,
        billing: emptyAddress,
        comment: "",
        termsAndConditions: false,
        marketingEmails: false,
        order: order,
        totalPrice: 0
    });
    useEffect(() => {

        function popstateHandler() {
            const url = new URLSearchParams(window.location.search);
            const urlPage = url.get("page");
            console.log("popstate", {urlPage});
            setPage(urlPage || "delivery");
            setNavigating(true);
        }


        addEventListener("popstate", popstateHandler);
        popstateHandler();
        return () => {
            removeEventListener("popstate", popstateHandler);
        };
    }, [])
    useEffect(() => {
        setNavigating(false);
    }, [navigating]);

    function navigateToPayment() {
        history.pushState({}, "", "?page=payment");
        dispatchEvent(new PopStateEvent("popstate"));
    }

    function navigateToSignUp() {
        history.pushState({}, "", "?page=signup")
        dispatchEvent(new PopStateEvent("popstate"))
    }

    function navigateToLogIn() {
        history.pushState({}, "", "?page=login")
        dispatchEvent(new PopStateEvent("popstate"))
    }

    function navigateToDelivery() {
        history.pushState({}, "", "?page=")
        dispatchEvent(new PopStateEvent("popstate"))
    }

    function navigateToHome() {
        history.pushState({}, ",", "")
        dispatchEvent(new PopStateEvent("popstate"))
    }

    const pageClasses = `card ${navigating ? "navigating" : "navigated"}`;

    function logOut() {
        setUser(undefined);
        navigateToDelivery();
    }

    return (
        <div>
            <div className="container">
                <div>
                    <div className="header">
                        <div className="background">
                            <div className="header-logo" onClick={navigateToDelivery}><img src={Logo} width="175px"/>
                            </div>
                            <div className="dropdown">
                                {user === undefined && (
                                    <div id="myDropdown" className="dropdown-content">
                                        <button onClick={navigateToSignUp} className="signUp">Sign up</button>
                                        <button onClick={navigateToLogIn} className="login">Login</button>
                                    </div>
                                )}
                                {user !== undefined && (
                                    <div id="myDropdown" className="dropdown-content">
                                        <button className="name">{user.email}</button>
                                        <button onClick={logOut} className="logout">Log Out</button>
                                    </div>)}

                            </div>
                        </div>
                    </div>
                    <div className="content">
                        {page === "delivery" && (
                            <div className="page-grid">
                                <div className="basket">
                                    <Basket
                                        order={order}
                                        setOrder={setOrder}
                                        setIsLoading={setIsLoading}
                                    />
                                </div>
                                <div className="delivery">
                                    <Delivery
                                        order={order}
                                        setOrderInfo={setOrderInfo}
                                        navigate={navigateToPayment}
                                    />
                                </div>
                            </div>
                        )}
                        {page === "payment" && (
                            <div className="page-grid">
                                <div className="basket">
                                    <PaymentBasket
                                        order={order}
                                    />
                                </div>
                                <div className="delivery">
                                    <Payment
                                        orderInfo={orderInfo}
                                    />
                                </div>
                            </div>
                        )}
                        {page === "signup" && (
                            <div className="page-grid">

                                <div className="sign-up">
                                    <Register
                                        setUser={setUser}
                                        navigateBack={navigateToDelivery}
                                    />
                                </div>


                            </div>)}
                        {page === "login" && (
                            <div className="page-grid">

                                <div className="login">
                                    <LogIn
                                        setUser={setUser}
                                        navigateBack={navigateToDelivery}
                                    />
                                </div>


                            </div>)}
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="loader-container">
                    <img src={Spinner} width="175px"/>
                </div>
            )}
        </div>
    )
}


export default App