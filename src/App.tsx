import React, {useState} from 'react';
import './App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";


function App() {
    return (
        <div>
        <div className= "header-logo">
            <img src={Logo} width="250px"/>

        </div>
        <div className="page-grid">
            <div className="basket">
                <Basket/>
            </div>
            <div className="delivery">
                <Delivery/>
            </div>
        </div>
        </div>

    )
}




export default App
