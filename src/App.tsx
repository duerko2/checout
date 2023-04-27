import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import Spinner from "./assets/loading-gif.gif";
import {Address, Item, Order, OrderInfo,} from "./types";
import {Payment} from "./Payment";
import {PaymentBasket} from "./PaymentBasket";

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
            }, 3000);
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
                        <div className="header-logo">
                            <img src={Logo} width="175px"/>

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
                                            navigateToPayment={navigateToPayment}
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default App