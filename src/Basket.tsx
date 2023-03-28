import React, {useEffect, useState} from "react";
import {Product, Zipcode, Item, Order} from "./types";
import minus from "./assets/trashCan.png";
import question from "./assets/question-mark.png";

// Dictionary of products
let products: { [id: string] : Product } = {};

export function Basket({order,setOrder,getTotal}:{order:{itemList:Item[],recurring:boolean},setOrder:(order:{itemList:Item[],recurring:boolean})=>void,getTotal:()=>number}) {
    const [show,setShowRebate] = useState<{ showRebate:boolean; product?:Product;pos:{x:number;y:number} }>({showRebate:false,product:undefined,pos:{x:0,y:0}});

    useEffect( () => {
            async function fetchProducts() {
                const URL = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";
                try {
                    const response = await fetch(URL);
                    const result = (await response.json()) as Product[];
                    result.map(
                        (p) => (products[p.id] = p)
                    );
                    console.log(result);
                } catch (e) {
                    console.log(e)
                }
            }
            async function fetchBasket() {
                // TODO: async kald til backend for at hente indkøbskurv

                let basket = [
                    {product: products["vitamin-c-500-200"], quantity: 1, giftWrap: false},
                    {product: products["trimmer"], quantity: 1, giftWrap: false},
                    {product: products["coffeebeans-500g"], quantity: 1, giftWrap: false},
                ];
                setOrder({itemList: basket, recurring: false});
            }
            fetchProducts().then(fetchBasket);
        }, []
    )

    function changeRecurringOrder() {
        if (order.recurring) {
            setOrder({itemList: order.itemList, recurring: false})
        } else {
            setOrder({itemList: order.itemList, recurring: true})
        }
    }

    function calculateSubtotal() {
        let subtotal : number = 0;
        order.itemList.map(
            (item) => (subtotal += (item.product.price * (1 - calculateRebate(item) * (1 / 100)) * item.quantity))
        )
        return subtotal;
    }

    if (order.itemList.length === 0) {
        return <div>
            <p>Basket is empty</p>
        </div>
    } else return (
        <div>
            <div className="background-box">
            <h2>Basket</h2>
        <BasketGrid
    order={order}
    setOrder={setOrder}
    show={show}
    setShowRebate={setShowRebate}
    />
    <div>
    <p>
        All orders over 300 DKK have a 10% discount
    </p>
    </div>
    <div>
        <div className="grand-total">
        <p>Sub-total: {calculateSubtotal().toFixed(2)} {order.itemList[0]?.product.currency}</p>
        </div>
        <div className="grand-total">
        <p>Discount: {(calculateSubtotal()-getTotal()).toFixed(2)} {order.itemList[0]?.product.currency}</p>
        </div>
        <div className="grand-total">
        <h2>GRAND TOTAL: {getTotal().toFixed(2)} {order.itemList[0]?.product.currency}</h2>
        </div>
    </div>

    <div className="recurring-order">
        <label>
            <h2>Monthly recurring order: <input type="checkbox" onChange={() => changeRecurringOrder()}/></h2>
    </label>
    </div>
            </div>

    <div>
    <ShowRebate
        showRebate={show.showRebate}
    product={show.product}
    pos={show.pos}
    />
    </div>
            <div className="background-box">
                <Suggestions
                order={order}
                setOrder = {setOrder}
                />
            </div>
    </div>
)
}

function BasketGrid({order,setOrder,show,setShowRebate}: {order:{itemList:Item[],recurring:boolean},setOrder:(order:{itemList:Item[],recurring:boolean})=>void,show:{ showRebate:boolean; product?:Product;pos:{x:number;y:number} },setShowRebate:(show:{ showRebate:boolean; product?:Product;pos:{x:number;y:number} })=>void}) {



    function changeGiftWrapped(item: Item) {
        let newItems = order.itemList.map(e => e);
        for (let i = 0; i < order.itemList.length; i++) {
            if (order.itemList[i].product.id === item.product.id) {
                newItems[i].giftWrap = !newItems[i].giftWrap
            }
        }
        setOrder({itemList:newItems,recurring:order.recurring});
    }

    function less(item: Item) {
        let newItems = order.itemList.map(e => e);
        for (let i = 0; i < order.itemList.length; i++) {
            if (order.itemList[i].product.id === item.product.id && order.itemList[i].quantity > 0) {
                newItems[i].quantity--;
            }
        }
        setOrder({itemList:newItems,recurring:order.recurring});
    }

    function more(item: Item) {
        let newItems = order.itemList.map(e => e);
        for (let i = 0; i < order.itemList.length; i++) {
            if (order.itemList[i].product.id === item.product.id) {
                newItems[i].quantity++;
                if(newItems[i].quantity>100){
                    newItems[i].quantity=100;
                }
            }
        }

        setOrder({itemList:newItems,recurring:order.recurring});
    }
    function removeItem(item: Item) {
        let newItems = order.itemList.map(e => e);
        for (let i = 0; i < order.itemList.length; i++) {
            if (order.itemList[i].product.id === item.product.id) {
                if (i === 0) {
                    newItems.shift();
                } else {
                    newItems.splice(i, 1);
                }
            }
        }
        setOrder({itemList:newItems,recurring:order.recurring});
    }

    function showRebateItem(item: Item, event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY
        if (show.pos.y === 0 && show.pos.x === 0) {
            setShowRebate({showRebate: true, product: item.product, pos: {x: x, y: y}})

        }
    }

    function unshowRebateItem(event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY
        if (show.pos.x != x && show.pos.y != y) {
            setShowRebate({showRebate: false, product: undefined, pos: {x: 0, y: 0}})
        }
    }

    return (<div >
            <div className="product-card">
            <div className="product-grid">
                <div className="grid-title" style={{width:"140px"}}> </div>
                <div className="grid-title">Product Name</div>
                <div className="grid-title">Discount</div>
                <div className="grid-title">Units</div>
                <div className="grid-title">Line price</div>
                <div className="grid-title">Gift Wrapped</div>
            </div>
            </div>

            {order.itemList.map((item) => (
                <div className="product-card">
                    <div className="product-grid">
                        <div className="grid-item" id="minus-thing">
                            <img src={item.product.imageUrl} height={120} width={120} />
                        </div>
                        <div title="itemName"     style={{display: "grid",alignContent:"space-between"}} >
                            <div>
                            <div>
                                <p><b>{item.product.name}</b></p>
                            </div>
                            <div>
                                <p>Unit price: {item.product.price} {item.product.currency}</p>
                            </div>
                            <div>
                                <p>{item.product.rebateQuantity>0 && <div>Buy {item.product.rebateQuantity} units for {item.product.rebatePercent}% discount
                                </div>}</p>
                            </div>
                            </div>
                            <div>
                                <p title="removeItem" className="minus-button" onClick={()=>removeItem(item)}>Remove Item</p>
                            </div>
                        </div>
                        <div className="grid-item">{calculateRebate(item)}%
                            <div className="rebate-question" onMouseEnter={(event) => showRebateItem(item, event)}
                                 onMouseLeave={(event) => unshowRebateItem(event)}><img src={question}
                                                                                        className="question-img"/></div>

                        </div>
                        <div className="grid-item" style={{display:"flex"}}>
                            <button className="unit-button" onClick={() => less(item)}>-</button>
                            <p title="units" style={{margin: "5px"}} >{item.quantity}</p>
                            <button className="unit-button" onClick={() => more(item)}>+</button>
                        </div>
                        <div
                            className="grid-item">{(item.product.price * (1 - calculateRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</div>
                        <div className="grid-item" style={{justifySelf:"center"}}>
                            <label>
                                <input title="giftwrapped" type="checkbox" onChange={() => changeGiftWrapped(item)}/>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
function ShowRebate(state: { showRebate: boolean; product?: Product; pos: { x: number; y: number } }) {
    if (state.showRebate && state.product && state.product.rebatePercent === 0)
        return (
            <div className="floating-rebate-card" style={{top: state.pos.y, left: state.pos.x}}>
                <p>No discount on this product</p>
            </div>
        )
    else if (state.showRebate && state.product)
        return (
            <div className="floating-rebate-card" style={{top: state.pos.y, left: state.pos.x}}>
                <p>Buy {state.product.rebateQuantity} to get {state.product.rebatePercent}% discount</p>
            </div>
        );
    else
        return (<div></div>);
}


function Suggestions( {order, setOrder}: {order:{itemList:Item[],recurring:boolean},setOrder:(order:{itemList:Item[],recurring:boolean})=>void} ) {
    let a : Array<Product> = [];
    for(let i=0;i<order.itemList.length;i++){
        let alreadyBought=false;
            for(let j=0;j<order.itemList.length;j++){
                if(order.itemList[j].product.id === order.itemList[i].product.upsellProductId){
                    alreadyBought=true;
                }
            }
        if(order.itemList[i].product.upsellProductId && !alreadyBought){
            a.push(products[order.itemList[i].product.upsellProductId]);
        }
        if(a.length>=3){
            break;
        }
    }

    // Fills in the list of recommendations
    for(let p in products){
        if(a.length>=3){
            break;
        }
        let alreadyBought=false;
        for(let j=0;j<order.itemList.length;j++){
            if(order.itemList[j].product.id === products[p].id){
                alreadyBought=true;
            }
        }
        if(!alreadyBought){
            a.push(products[p]);
        }
    }


    function addToOrder(p: Product) {
        setOrder({itemList:[...order.itemList, {product: p, quantity: 1, giftWrap: false}],recurring:order.recurring});
    }
    return (
        <div className="suggestions">
            <h2>You might also like</h2>

            <div className="suggestion-grid">
            {a.map((item) => (
                <div title="suggestion" className="suggestion-card" onClick={()=>addToOrder(item)}>
                    <p title="suggestion-name">{item.name}</p>
                    <p>{item.price} {item.currency}</p>
                </div>

            ))}
            </div>
        </div>
    );
}

function calculateRebate(item: Item) {
    if (item.quantity >= item.product.rebateQuantity && item.product.rebateQuantity != 0) {
        return item.product.rebatePercent;
    } else return 0;
}
