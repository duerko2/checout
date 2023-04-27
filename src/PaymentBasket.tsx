import React from 'react';
import {Order} from "./types";
import {OrderSummary} from "./OrderSummary";
import {BasketGrid} from "./BasketGrid";


export function PaymentBasket({order}: { order: Order }) {
    return (

        <div>
            <div className="background-box">
                <h2>Order Summary</h2>
                <BasketGrid
                    order={order}
                    editable={false}
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

