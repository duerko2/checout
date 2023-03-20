import React, {useState} from 'react';
import './App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";


function App() {
    return (
        <div className="page-grid">
            <div className="basket">
                <Basket/>
            </div>
            <div className="delivery">
                <Delivery/>
            </div>
        </div>
    )
}




export default App
