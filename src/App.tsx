import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import Spinner from "./assets/loading-gif.gif";
import {Address, Item, Order, OrderInfo,} from "./types";
import {Payment} from "./Payment";
import {PaymentBasket} from "./PaymentBasket";
import {SignUp} from "./SignUp";

const emptyAddress : Address = {
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

        function simulateLoading() {
            setTimeout(() => {
                setIsLoading(false);
            }, 1200);
        }

        simulateLoading();

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

    function navigateToSigUp(){
        history.pushState({}, "","?page=login")
        dispatchEvent(new PopStateEvent("popstate"))
    }




    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }


    const pageClasses = `card ${navigating ? "navigating" : "navigated"}`;

    return (
        <div>
            <div className="container">
                {isLoading ? (
                    <div className="loader-container">

                            <img src={Spinner} width="175px"/>

                    </div>
                ) : (
                    <div>
                        <div className="header" >
                            <div className="header-logo"><img src={Logo} width="175px"/></div>
                            <div className="dropdown">
                                <button onSubmit="myFunction()" className="dropbtn">Dropdown</button>
                                <div id="myDropdown" className="dropdown-content">
                                    <button onClick="navigateToLogin" className="signUp">Sign up</button>
                                    <button onClick="" className="login">Login</button>

                                </div>
                            </div>
                        </div>
                        <div className="content">
                            {page === "delivery" && (
                                <div className="page-grid">
                                    <div className="basket">
                                        <Basket
                                            order={order}
                                            setOrder={setOrder}/>
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
                                <div className = "signup">
                                    <SignUp

                                    />




                                </div>)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default App