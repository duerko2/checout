import {getSubtotal, getTotal} from "./OrderUtilityFunctions";
import React from "react";
import {Order} from "./types";

export function OrderSummary({order}: { order: Order }) {
    return (
        <div>
            <div className="grand-total">
                <p>Sub-total: {getSubtotal(order).toFixed(2)} {order.itemList[0]?.product.currency}</p>
            </div>
            <div className="grand-total">
                <p>Discount: {(getSubtotal(order) - getTotal(order)).toFixed(2)} {order.itemList[0]?.product.currency}</p>
            </div>
            <div className="grand-total">
                <h2>GRAND TOTAL: {getTotal(order).toFixed(2)} {order.itemList[0]?.product.currency}</h2>
            </div>
        </div>
    )
}