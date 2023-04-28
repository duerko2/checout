import {Item, Order, Product} from "./types";
import React from "react";
import {getRebate} from "./OrderUtilityFunctions";
import question from "./assets/question-mark.png";

type basketGridProps = {
    order: Order,
    setOrder?: (order: Order) => void,
    show?: { showRebate: boolean; product?: Product; pos: { x: number; y: number } },
    setShowRebate?: (show: { showRebate: boolean; product?: Product; pos: { x: number; y: number } }) => void
    editable: boolean
}

export function BasketGrid({order,setOrder,show,setShowRebate,editable}: basketGridProps) {


    function changeGiftWrapped(item: Item) {
        if(!editable) return;
        const itemIndex = order.itemList.indexOf(item);
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].giftWrap = !newItems[itemIndex].giftWrap;

        if (setOrder) {
            setOrder({itemList: newItems, recurring: order.recurring});
        }
    }

    function less(item: Item) {
        // Guard clause
        if (item.quantity === 0) return;

        const itemIndex = order.itemList.indexOf(item)
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].quantity--;

        if (setOrder) {
            setOrder({itemList: newItems, recurring: order.recurring});
        }
    }

    function more(item: Item) {
        // Guard clause
        if (item.quantity >= 100) return;

        const itemIndex = order.itemList.indexOf(item)
        const newItems = order.itemList.map(e => e);
        newItems[itemIndex].quantity++;


        //console.log(JSON.stringify(order));
        if (setOrder) {
            setOrder({itemList: newItems, recurring: order.recurring});
        }
    }

    function removeItem(item: Item) {
        const newItems = order.itemList.filter(e => e.product._id !== item.product._id)

        if (setOrder) {
            setOrder({itemList: newItems, recurring: order.recurring});
        }
    }

    function showRebateItem(item: Item, event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY;
        if(!show) return;

        if (show.pos.y === 0 && show.pos.x === 0 && setShowRebate) {
            setShowRebate({showRebate: true, product: item.product, pos: {x: x, y: y}})
        }
    }

    function unshowRebateItem(event: React.MouseEvent<HTMLDivElement>) {
        const x = event.pageX;
        const y = event.pageY
        if(!show) return;
        if (show.pos.x != x && show.pos.y != y && setShowRebate) {
            setShowRebate({showRebate: false, product: undefined, pos: {x: 0, y: 0}})
        }
    }

    return (<div>
            <div className="product-card">
                <div className="product-grid">
                    <div className="grid-title" id="blank-grid-item"></div>
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
                            <img src={item.product.imageUrl} className="product-image"
                                 alt={item.product.name + " icon"}/>
                        </div>
                        <div title="itemName" style={{display: "grid", alignContent: "space-between"}}>
                            <div>
                                <div>
                                    <p><b>{item.product.name}</b></p>
                                </div>
                                <div>
                                    <p>Unit price: {item.product.price} {item.product.currency}</p>
                                </div>
                                {editable && (
                                <div>
                                    <div>{item.product.rebateQuantity > 0 &&
                                        <p>Buy {item.product.rebateQuantity} units for {item.product.rebatePercent}%
                                            discount
                                        </p>}</div>
                                </div>
                                )}
                            </div>
                            {editable && (
                            <div>
                                <p title="removeItem" className="minus-button" onClick={() => removeItem(item)}>Remove
                                    Item</p>
                            </div>
                                )}
                        </div>
                        <div className="grid-item">
                            <p>{getRebate(item)}%</p>
                        </div>
                        <div className="grid-item" id="unit-area">
                            {editable && (
                            <button className="unit-button" onClick={() => less(item)}>-</button>
                                )}
                            <p title="units" style={{margin: "5px"}}>{item.quantity}</p>
                            {editable && (
                            <button className="unit-button" onClick={() => more(item)}>+</button>
                                )}
                        </div>
                        <div
                            className="grid-item">
                            <p>{(item.product.price * (1 - getRebate(item) * (1 / 100)) * item.quantity).toFixed(2)} {item.product.currency}</p>
                        </div>
                        <div className="grid-item" style={{justifySelf: "center"}}>
                            <label>
                                <input title="giftwrapped" type="checkbox" onChange={() => changeGiftWrapped(item)} readOnly={!editable} checked={item.giftWrap}/>
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}