import React, {useState} from 'react';
import './App.css';
import minus from'./assets/trashCan.png';
import question from './assets/question-mark.png';




function App() {
    return(
        <div className="page-grid">
            <div className="basket">
                <Basket />
            </div>
            <div className="delivery">
                <Delivery/>
            </div>
        </div>
    )
}

function Basket() {
    let products: { [id: string] : Product } = {};
    let zipcodes: Array<Zipcode>;
    const [loaded,setLoaded] = useState<Boolean>(false);
    const [show,setShowRebate] = useState<{ showRebate:boolean; product?:Product;pos:{x:number;y:number} }>({showRebate:false,product:undefined,pos:{x:0,y:0}});
    const [itemList,setItems] = useState<Item[]>([]);
    const [order,setOrder] = useState<Order>({itemList:itemList,recurring:false});



    if(!loaded) {
        fetchProducts().then(fetchBasket);
        fetchZip().then(fetchZip);
        setLoaded(true)
    }

    async function fetchProducts() {
        const URL = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product.json";
        try {
            const response = await fetch(URL);
            const result = (await response.json()) as Product[];
            result.map(
                (p) => (products[p.id] = p)
            );
        } catch(e){
            console.log(e)
        }
    }

    async function fetchZip() {
        const URL = "https://api.dataforsyningen.dk/postnumre";
        try {
            const response = await fetch(URL);
            const result = (await response.json()) as Zipcode[];
            zipcodes = result;
        } catch(e){
            console.log(e)
        }
    }

    function checkZip(Inputzip: string){
        for(var i = 0; i < zipcodes.length; i++){
            if(zipcodes[i].nr==Inputzip){
                return true;
            }
        }
        return false;
    }

    async function fetchBasket() {
        // TODO: async kald til backend for at hente indkøbskurv

        let basket = [
            { product: products["coffeebeans-organic-500g"], quantity: 1, giftWrap: false },
            { product: products["coffee-grinder-pro"], quantity: 1, giftWrap: false },
            { product: products["coffeebeans-500g"], quantity: 1, giftWrap: false },

        ];
        setItems(basket);
    }
    function getTotal() {
        let total : number = 0;
        itemList.forEach(p=>total+=p.product.price*(1-p.product.rebatePercent*(1/100))*p.quantity);
        if(total>300){
            total = total*0.9;
        }
        return total;
    }
    function changeRecurringOrder() {
        if (order.recurring){
            setOrder({itemList:itemList,recurring:false})
        } else {
            setOrder({itemList:itemList,recurring:true})
        }
    }
    if(itemList.length===0){
        return <div>
            <p>Basket is empty</p>
        </div>
    } else return (
        <div>
            <h2>Basket</h2>
            <BasketGrid
                itemList={itemList}
                setItems={setItems}
                show={show}
                setShowRebate={setShowRebate}
            />
            <div className="grand-total" >
                <h2>GRAND TOTAL: {getTotal().toFixed(2) } {itemList[0]?.product.currency}</h2>
            </div>

            <div className="recurring-order">
                <label>
                    <h2>Monthly recurring order: <input type="checkbox" onChange={()=>changeRecurringOrder()}/></h2>
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

function BasketGrid({itemList,setItems,show,setShowRebate}: {itemList:Item[],setItems:(items:Item[])=>void,show:{ showRebate:boolean; product?:Product;pos:{x:number;y:number} },setShowRebate:(show:{ showRebate:boolean; product?:Product;pos:{x:number;y:number} })=>void}) {

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

    return (<div>
            <div className="product-grid">
                <div className="grid-title"></div>
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
                        <div className="grid-item" style={{placeSelf:"center"}}>
                            <label>
                                <input type ="checkbox" onChange={()=>changeGiftWrapped(item)}/>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}


function ShowRebate(state: { showRebate:boolean; product?:Product;pos:{x:number;y:number} }){
    if(state.showRebate && state.product && state.product.rebatePercent===0)
        return(
            <div className="floating-rebate-card" style={{top:state.pos.y,left:state.pos.x}}>
                <p>No discount on this product</p>
            </div>
        )
    else if(state.showRebate && state.product)
        return(
            <div className="floating-rebate-card" style={{top:state.pos.y,left:state.pos.x}}>
                <p>Buy {state.product.rebateQuantity} to get {state.product.rebatePercent}% discount</p>
            </div>
        );
    else
        return (<div></div>);
}


type Product = {
    id: string;
    name: string;
    price: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string;
};

type Zipcode = {
    href: string;
    nr: string;
    navn: string;
    bigreceiver: string;
    bbox: Array<number>;
    visual: Array<number>;
    commune: { [key: string]: string};
    changedDate: string;
    locationChangedDate: string;
    locationVersion: number;
    dagi_id: string;


}

type Item ={ product: Product; quantity: number; giftWrap: boolean };
type Order = { itemList:Item[]; recurring: boolean };

function Delivery() {

    return (<div className="delivery-form">
        <form>
            <ul>
                <li>
                    <label key="name">Name: </label>
                    <input type="text" id="name" name="name" placeholder="Name"/>
                </li>
                <li>
                    <label key="phone">Phone: </label>
                    <input type="tel" id="phone" name="phone" placeholder="00 00 00 00"/>
                </li>
                <li>
                    <label key="email">E-mail: </label>
                    <input type="email" id="email" name="email" placeholder="eksempel@eksempel.dk"/>
                </li>
                <li>
                    <label key="address">Address: </label>
                    <input type="text" id="address" name="address" placeholder="Address"/>
                    <input type="text" id="address" name="address" placeholder="Address 2nd line"/>

                </li>
                <li>
                    <label key="zip">Zip: </label>
                    <input type="text" id="zip" name="zip" placeholder="Zip"/>
                </li>
                <li>
                    <label key="city">City: </label>
                    <input type="text" id="city" name="city" placeholder="City"/>
                </li>
                <li>
                    <label key="country">Country: </label>
                    <input type="text" id="country" name="country" placeholder="Country"/>
                </li>
                <li className="button">
                    <button type="submit">Go to payment</button>
                </li>
            </ul>
        </form>
    </div>);
}

export default App
