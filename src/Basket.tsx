import React, {useEffect, useState} from "react";
import {Item, Product} from "./types";
import {getRebate} from "./OrderUtilityFunctions";
import question from "./assets/question-mark.png";
import {OrderSummary} from "./OrderSummary";

// Dictionary of products
let products: { [id: string]: Product } = {};

export function Basket({
                           order,
                           setOrder
                       }: { order: { itemList: Item[], recurring: boolean }, setOrder: (order: { itemList: Item[], recurring: boolean }) => void }) {
    const [show, setShowRebate] = useState<{ showRebate: boolean; product?: Product; pos: { x: number; y: number } }>({
        showRebate: false,
        product: undefined,
        pos: {x: 0, y: 0}
    });

    useEffect(() => {
            async function fetchProducts() {
                const URL = "http://130.225.170.79:8080/products";

                try {
                    const response = await fetch(URL);
                    const result = (await response.json()) as Product[];
                    result.map(
                        (p) => (products[p._id] = p)
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
        setOrder({itemList: order.itemList, recurring: !order.recurring})
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
                <OrderSummary
                    order={order}/>
                <div className="recurring-order">
                    <label>
                        <h2>Monthly recurring order: <input type="checkbox" onChange={() => changeRecurringOrder()}/>
                        </h2>
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
                    setOrder={setOrder}
                />
            </div>
        </div>
    )
}

function BasketGrid({
                        order,
                        setOrder,
                        show,
                        setShowRebate
                    }: { order: { itemList: Item[], recurring: boolean }, setOrder: (order: { itemList: Item[], recurring: boolean }) => void, show: { showRebate: boolean; product?: Product; pos: { x: number; y: number } }, setShowRebate: (show: { showRebate: boolean; product?: Product; pos: { x: number; y: number } }) => void }) {


    function changeGiftWrapped(item: Item) {
        const itemIndex = order.itemList.indexOf(item)
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].giftWrap = !newItems[itemIndex].giftWrap;

        setOrder({itemList: newItems, recurring: order.recurring});
    }

    function less(item: Item) {
        // Guard clause
        if (item.quantity === 0) return;

        const itemIndex = order.itemList.indexOf(item)
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].quantity--;

        setOrder({itemList: newItems, recurring: order.recurring});
    }

    function more(item: Item) {
        // Guard clause
        if (item.quantity >= 100) return;

        const itemIndex = order.itemList.indexOf(item)
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].quantity++;

        setOrder({itemList: newItems, recurring: order.recurring});
    }

    function removeItem(item: Item) {
        const newItems = order.itemList.filter(e => e.product._id !== item.product._id)

        setOrder({itemList: newItems, recurring: order.recurring});
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

    return (<div>
            <div className="product-card">
                <div className="product-grid">
                    <div className="grid-title" style={{width: "140px"}}></div>
                    <div className="grid-title">Product</div>
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
                            <img src={item.product.imageUrl} height={120} width={120} alt={item.product.name + " icon"}/>
                        </div>
                        <div title="itemName" style={{display: "grid", alignContent: "space-between"}}>
                            <div>
                                <div>
                                    <p><b>{item.product.name}</b></p>
                                </div>
                                <div>
                                    <p>Unit price: {item.product.price} {item.product.currency}</p>
                                </div>
                                <div>
                                    <p>{item.product.rebateQuantity > 0 &&
                                        <div>Buy {item.product.rebateQuantity} units for {item.product.rebatePercent}%
                                            discount
                                        </div>}</p>
                                </div>
                            </div>
                            <div>
                                <p title="removeItem" className="minus-button" onClick={() => removeItem(item)}>Remove
                                    Item</p>
                            </div>
                        </div>
                        <div className="grid-item">{getRebate(item)}%
                            <div className="rebate-question" onMouseEnter={(event) => showRebateItem(item, event)}
                                 onMouseLeave={(event) => unshowRebateItem(event)}><img src={question}
                                                                                        className="question-img" alt={"buy "+item.product.rebateQuantity+" to get " +item.product.rebatePercent+"% discount"}/></div>

                        </div>
                        <div className="grid-item" style={{display: "flex"}}>
                            <button className="unit-button" onClick={() => less(item)}>-</button>
                            <p title="units" style={{margin: "5px"}}>{item.quantity}</p>
                            <button className="unit-button" onClick={() => more(item)}>+</button>
                        </div>
                        <div
                            className="grid-item">{(item.product.price * (1 - getRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</div>
                        <div className="grid-item" style={{justifySelf: "center"}}>
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


function Suggestions({
                         order,
                         setOrder
                     }: { order: { itemList: Item[], recurring: boolean }, setOrder: (order: { itemList: Item[], recurring: boolean }) => void }) {
    let suggestions: Array<Product> = [];

    // Adds suggestions based on upsell id
    order.itemList.forEach((item) => {

        // Checks if the upsell product is already in basket
        let alreadyBought = false;
        order.itemList.forEach((item2) => {
            if (item2.product._id === item.product.upsellProductId) {
                alreadyBought = true;
            }
        })

        // If not there is an upsell product, and it is not already in basket, add it to suggestions
        if (item.product.upsellProductId && !alreadyBought) {
            suggestions.push(products[item.product.upsellProductId]);
        }

        // Max 3 suggestions
        if (suggestions.length >= 3) {
            return;
        }
    })

    // Fills in the list of recommendations with products not in the basket
    for (let p in products) {
        if (suggestions.length >= 3) {
            break;
        }
        let alreadyBought = false;
        order.itemList.forEach((item) => {
            if (item.product._id === products[p]._id) {
                alreadyBought = true;
            }
        })
        if (!alreadyBought) {
            suggestions.push(products[p]);
        }
    }


    function addToOrder(p: Product) {
        setOrder({
            itemList: [...order.itemList, {product: p, quantity: 1, giftWrap: false}],
            recurring: order.recurring
        });
    }

    return (
        <div className="suggestions">
            <h2>You might also like</h2>

            <div className="suggestion-grid">
                {suggestions.map((item) => (
                    <div>

                        <div title="suggestion" className="suggestion-card" onClick={() => addToOrder(item)}>
                            <div style={{textAlign: "center"}}>
                                <img src={item.imageUrl} height={120} width={120} alt={"Order suggestion icon for product: "+item.name}/>
                            </div>
                            <p title="suggestion-name">{item.name}</p>
                            <p>{item.price} {item.currency}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}


