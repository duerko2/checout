import {useEffect, useState} from 'react'
import './App.css'
import React from 'react';
import minus from './minus.png';
import question from './question-mark.png';




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
    const [loaded,setLoaded] = useState<Boolean>(false);
    const [show,setShowRebate] = useState<{ showRebate:boolean; product?:Product;pos:{x:number;y:number} }>({showRebate:false,product:undefined,pos:{x:0,y:0}});
    const [itemList,setItems] = useState<Item[]>([]);
    let recurring: boolean;

    if(!loaded) {
        fetchProducts();
        setLoaded(true)
    }

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

    function changeRecurringOrder() {
        if (recurring==false){
            recurring=true
        }else if (recurring==true){
            recurring=false
        }
    }

    function removeItem(item: Item) {
        let newItems=itemList.map(e=>e);
        for(let i=0;i<itemList.length;i++){
            if(itemList[i].product.id===item.product.id){
                if(i===0){
                    newItems.shift();
                } else {
                    newItems.splice(i,1);
                }
            }
        }
        setItems(newItems);
    }

    function showRebateItem(item: Item, event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY
        if(show.pos.y===0 && show.pos.x===0){
            setShowRebate({showRebate: true, product: item.product, pos: {x: x, y: y}})

        }
    }

    function unshowRebateItem(event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY
        if(show.pos.x!=x && show.pos.y!=y) {
            setShowRebate({showRebate: false, product: undefined, pos: {x: 0, y: 0}})
        }
    }

    return (
        <div>
            <h2>Basket</h2>
            <div className="product-grid">
                <div className="grid-title"></div>
                <div className="grid-title">Product ID</div>
                <div className="grid-title">Product Name</div>
                <div className="grid-title">Unit Price</div>
                <div className="grid-title">Discount</div>
                <div className="grid-title">Units</div>
                <div className="grid-title">Total Price</div>
                <div className="grid-title">Gift Wrapped</div>
            </div>
                {itemList.map((item)=>(
                    <div className="product-card">
                        <div className="product-grid">
                        <div className="grid-item" id="minus-thing">
                            <button onClick={()=>removeItem(item)} className="minus-button"><img src={minus} height="25" width="25"/></button>
                        </div>
                        <div className="grid-item">{item.product.id}</div>
                        <div className="grid-item">{item.product.name}</div>
                        <div className="grid-item">{item.product.price} {item.product.currency}</div>
                        <div className="grid-item">{calculateRebate(item)}%
                            <div className="rebate-question" onMouseEnter={(event)=>showRebateItem(item,event)} onMouseLeave={(event)=>unshowRebateItem(event)}> <img src={question} className="question-img"/></div>

                        </div>
                        <div className="grid-item">
                            <button className="unit-button" onClick={() => less(item)}>-</button>
                            <a>{item.quantity}</a>
                            <button className="unit-button" onClick={() => more(item)}>+</button>
                        </div>
                        <div className="grid-item">{(item.product.price * (1 - calculateRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</div>
                            <div className="grid-item">
                                <label>
                                    <input type ="checkbox" onChange={()=>changeGiftWrapped(item)}/>
                                </label>
                            </div>
                        </div>
                    </div>
                    ))}
            <div className="grand-total">
                <h2>GRAND TOTAL: {getTotal().toFixed(2) } {itemList[0]?.product.currency}</h2>
            </div>

            <div className="recurring-order">
                <label>
                    <h2>Recurring order: <input type="checkbox" onChange={()=>changeRecurringOrder()}/></h2>

                </label>
            </div>

            <div>
                <ShowRebate
                 showRebate={show.showRebate}
                 product={show.product}
                 pos={show.pos}
                />
            </div>
        </div>
    )
}

function ShowRebate(state: { showRebate:boolean; product?:Product;pos:{x:number;y:number} }){
    if(state.showRebate && state.product)
        return(
            <div className="floating-rebate-card" style={{top:state.pos.y,left:state.pos.x}}>
                <p>Buy {state.product.rebateQuantity} to get {state.product.rebatePercent}% discount</p>
            </div>
        );
    else
        return (<div></div>);
}


export default App
