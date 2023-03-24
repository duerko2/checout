import React, {useState} from 'react';
import './App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import {Order, } from "./types";


function App() {
    const [order,setOrder] = useState<Order>({itemList:[],recurring:false});
    return (
        <div>
        <div className= "header-logo">
            <img src={Logo} width="250px"/>

        </div>
        <div className="page-grid">
            <div className="basket">
                <Basket
                order={order}
                setOrder={setOrder}/>
            </div>
            <div className="delivery">
                <Delivery
                    order={order}
                    setOrder={setOrder}/>
            </div>
        </div>
        </div>

    )
}




export default App
