import React, {useEffect, useState} from 'react';
import './App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import {Order, OrderInfo,} from "./types";
import {Payment} from "./Payment";


function App() {
    const [page, setPage] = useState("delivery");
    const [navigating, setNavigating] = useState(true);
    const [order,setOrder] = useState<Order>({itemList:[],recurring:false});
    const [orderInfo,setOrderInfo] = useState<OrderInfo>({delivery:{name:"",phone:"",email:"",address:"",zip:"",city:"",country:"",company:"",VAT:""},separateBilling:false,billing:{billingAddress:"",billingCity:"",billingCompany:"",billingCountry:"",billingEmail:"",billingName:"",billingPhone:"",billingVAT:"",billingZip:""},comment:"",termsAndConditions:false,marketingEmails:false,order:order,totalPrice:0});

    useEffect(() => {
        function popstateHandler() {
            const url = new URLSearchParams(window.location.search);
            const urlPage = url.get("page");
            console.log("popstate", { urlPage });
            setPage(urlPage || "delivery");
            setNavigating(true);
        }
        addEventListener("popstate", popstateHandler);
        popstateHandler();
        return () => {
            removeEventListener("popstate", popstateHandler);
        };
    },[])
    useEffect(() => {
        setNavigating(false);
    }, [navigating]);
    function navigateToPayment() {
        history.pushState({}, "", "?page=payment");
        dispatchEvent(new PopStateEvent("popstate"));
    }
    const pageClasses = `card ${navigating ? "navigating" : "navigated"}`;
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
    return (
        <div>
        <div className= "header-logo">
            <img src={Logo} width="250px"/>

        </div>
<div className="content">
                <div className="page-grid">
                    <div className="basket">
                        <Basket
                        order={order}
                        setOrder={setOrder}
                        getTotal={getTotal}/>
                    </div>
                    {page === "delivery" && (
                    <div className="delivery">
                        <Delivery
                            order={order}
                            setOrder={setOrder}
                            getTotal={getTotal}
                            setOrderInfo={setOrderInfo}
                            navigateToPayment={navigateToPayment}
                        />
                    </div>)}
                    {page === "payment" && (
                        <div className="delivery">
                            <Payment
                                orderInfo={orderInfo}
                                />
                        </div>)}

                </div>
</div>
        </div>

    )
}





export default App