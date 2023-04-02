import React from 'react';
import {Order} from "./types";
import {getRebate,getTotal,getSubtotal} from "./OrderUtilityFunctions";


export function OrderBox({order}: {order: Order}) {
    return (

        <div>
            <div className="background-box">
                <h2>Order</h2>
                <OrderItems
                    order={order}
                />
                <div>
                    <div className="grand-total">
                        <p>Sub-total: {getSubtotal(order).toFixed(2)} {order.itemList[0]?.product.currency}</p>
                    </div>
                    <div className="grand-total">
                        <p>Discount: {(getSubtotal(order)-getTotal(order)).toFixed(2)} {order.itemList[0]?.product.currency}</p>
                    </div>
                    <div className="grand-total">
                        <h2>GRAND TOTAL: {getTotal(order).toFixed(2)} {order.itemList[0]?.product.currency}</h2>
                    </div>
                </div>

                <div className="recurring-order">
                    <label>
                        <h2>Monthly recurring order: <input type="checkbox" checked={order.recurring} readOnly={true}/></h2>
                    </label>
                </div>
            </div>
        </div>
    )
}
function OrderItems(props: { order: Order }) {


return null;
}