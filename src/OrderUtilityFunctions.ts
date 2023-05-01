import {Item, Order} from "./types";

export {getRebate, getTotal, getSubtotal};

function getRebate(item: Item) {
    if (item.quantity >= item.product.rebateQuantity && item.product.rebateQuantity != 0) {
        return item.product.rebatePercent;
    } else return 0;
}

function getTotal(order: Order) {

    let total: number = 0;
    let total2: number = 0;
    order.itemList.forEach(p => {
        if (p.quantity >= p.product.rebateQuantity) {
            total += p.product.price * (1 - p.product.rebatePercent * (1 / 100)) * p.quantity
        } else {
            total += p.product.price * p.quantity;
        }
        total2 = total
        if (total2 > 300) {
            total2 = total * 0.9;
        }
    })
    return total2;
}

function getSubtotal(order: Order) {
    let subtotal: number = 0;
    order.itemList.map(
        (item) => (subtotal += (item.product.price * (1 - getRebate(item) * (1 / 100)) * item.quantity))
    )
    return subtotal;
}