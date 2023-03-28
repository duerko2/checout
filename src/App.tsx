import React, {useState} from 'react';
import './App.css';
import {Basket} from "./Basket";
import {Delivery} from "./Delivery";
import Logo from "./assets/WebshopLogo.png";
import {Order, } from "./types";


function App() {
    const [order,setOrder] = useState<Order>({itemList:[],recurring:false});
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
                    <div className="delivery">
                        <Delivery
                            order={order}
                            setOrder={setOrder}
                            getTotal={getTotal}/>
                    </div>
                </div>
</div>
        </div>

    )
}





export default App