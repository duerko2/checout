import React from 'react';
import {Order} from "./types";
import {getRebate, getTotal, getSubtotal} from "./OrderUtilityFunctions";
import question from "./assets/question-mark.png";
import {OrderSummary} from "./OrderSummary";


export function OrderBox({order}: { order: Order }) {
    return (

        <div>
            <div className="background-box">
                <h2>Order Summary</h2>
                <OrderItems
                    order={order}
                />
                <OrderSummary
                    order={order}/>
                <div className="recurring-order">
                    <label>
                        <h2>Monthly recurring order: <input type="checkbox" checked={order.recurring} readOnly={true}/>
                        </h2>
                    </label>
                </div>
            </div>
        </div>
    )
}

function OrderItems({order}: { order: Order }) {


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
                            <img src={item.product.imageUrl} height={120} width={120}/>
                        </div>
                        <div title="itemName" style={{display: "grid", alignContent: "space-between"}}>
                            <div>
                                <div>
                                    <p><b>{item.product.name}</b></p>
                                </div>
                                <div>
                                    <p>Unit price: {item.product.price} {item.product.currency}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid-item">{getRebate(item)}%
                        </div>
                        <div className="grid-item" style={{display: "flex"}}>
                            <p title="units" style={{margin: "5px"}}>{item.quantity}</p>
                        </div>
                        <div
                            className="grid-item">{(item.product.price * (1 - getRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</div>
                        <div className="grid-item" style={{justifySelf: "center"}}>
                            <label>
                                <input title="giftwrapped" type="checkbox" readOnly={true} checked={item.giftWrap}/>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}