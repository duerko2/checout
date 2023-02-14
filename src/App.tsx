import {useState} from 'react'
import './App.css'
import React from 'react';
import minus from '/assets/minus-png.png'




function App() {
    return(
        <div className="basket">
            <Basket />
        </div>
    )
}
type Product = {
    id: string;
    name: string;
    price: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string;
}
type Item ={ product: Product; quantity: number; giftWrap: boolean }

function Basket() {
    const [itemList,setItems] = useState<Item[]>([])
    if(!itemList[0]){fetchProducts();}
    async function fetchProducts() {
        const URL = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product.json";
        try {
            const response = await fetch(URL);
            const result = (await response.json()) as Product[];

            setItems(result.map(
                (p) => ({product: p,quantity:0,giftWrap:false})
            ));

        } catch(e){
            console.log(e)
        }
    }
    function getAverageProductPrice(){

    }

    function less(item : Item) {
        let newItems=itemList.map(e=>e);
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].product.id===item.product.id && itemList[i].quantity>0){
                newItems[i].quantity--;
            }
        }
        setItems(newItems);
    }

    function more(item : Item) {
        let newItems=itemList.map(e=>e);
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].product.id===item.product.id){
                newItems[i].quantity++;
            }
        }
        setItems(newItems);
    }

    function getTotal() {
        let total : number = 0;
        itemList.forEach(p=>total+=p.product.price*(1-p.product.rebatePercent*(1/100))*p.quantity);
        return total;
    }

    function calculateRebate(item: Item) {
        if(item.quantity>=item.product.rebateQuantity && item.product.rebateQuantity!=0){
            return item.product.rebatePercent;
        } else return 0;
    }

    function changeGiftWrapped(item: Item) {
        let newItems=itemList.map(e=>e);
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].product.id===item.product.id){
                newItems[i].giftWrap=!newItems[i].giftWrap
            }
        }
        setItems(newItems);
    }

    function removeItem(item: Item) {
        let newItems=itemList.map(e=>e);
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].product.id===item.product.id){
                newItems.splice(i,i);
            }
        }
        setItems(newItems);
    }

    return (
        <div>
            <p>Basket</p>
            <div className="product-grid">
                <div></div>
                <div className="grid-title">Product ID</div>
                <div className="grid-title">Product Name</div>
                <div className="grid-title">Unit Price</div>
                <div className="grid-title">Discount</div>
                <div className="grid-title">Units</div>
                <div className="grid-title">Total Price</div>
                <div className="grid-title">Gift Wrapped</div>

                {itemList.map((item)=>(
                    <>
                        <div>
                            <img src={minus} onClick={()=>removeItem(item)}/>
                        </div>
                        <div className="grid-item">{item.product.id}</div>
                        <div className="grid-item">{item.product.name}</div>
                        <div className="grid-item">{item.product.price} {item.product.currency}</div>
                        <div className="grid-item">{calculateRebate(item)}%</div>
                        <div className="grid-item">
                            <button className="unit-button" onClick={() => less(item)}>-</button>
                            <a>{item.quantity}</a>
                            <button className="unit-button" onClick={() => more(item)}>+</button>
                        </div>
                        <div className="grid-item">{(item.product.price * (1 - calculateRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</div>
                        <div className="grid-item">
                            <label>
                                <input type="checkbox" onChange={()=>changeGiftWrapped(item)}/>
                            </label>
                        </div>
                    </>
                    ))}
            </div>
            <div className="grand-total">
                <p>GRAND TOTAL: {getTotal().toFixed(2) } {itemList[0]?.product.currency}</p>
            </div>
        </div>
    )
}


export default App
