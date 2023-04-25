import React, {useEffect, useState} from "react";
import "./styles/Basket.css";
import {Item, Product} from "./types";
import {OrderSummary} from "./OrderSummary";
import {BasketGrid} from "./BasketGrid";

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
                    editable={true}
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
            <div className="background-box">
                <Suggestions
                    order={order}
                    setOrder={setOrder}
                />
            </div>
        </div>
    )
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
                                <img src={item.imageUrl} className="product-image" alt={"Order suggestion icon for product: "+item.name}/>
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


