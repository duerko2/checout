export type {Product, Zipcode, Item, Order, PurchaseInfo, OrderInfo, Address};

type Address = {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    company: string;
    VAT: string;
}

type Product = {
    _id: string;
    name: string;
    price: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string;
    imageUrl: string;
};

type Zipcode = {
    href: string;
    nr: string;
    navn: string;
    bigreceiver: string;
    bbox: Array<number>;
    visual: Array<number>;
    commune: { [key: string]: string };
    changedDate: string;
    locationChangedDate: string;
    locationVersion: number;
    dagi_id: string;


}

type Item = { product: Product; quantity: number; giftWrap: boolean };
type Order = { itemList: Item[]; recurring: boolean };

type PurchaseInfo = {
    order: Order;
    price: number
    name: String;
    phone: string;
    email: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    company: string;
    VAT: string
    billingName: string;
    billingPhone: string;
    billingEmail: string;
    billingAddress: string;
    billingZip: string;
    billingCity: string;
    billingCountry: string;
    billingCompany: string;
    billingVAT: string;
    termsAndConditions: Boolean;
    marketingEmails: Boolean;
    comment: string;
}

type OrderInfo= {
    delivery: {
        name: string;
        phone: string;
        email: string;
        address: string;
        zip: string;
        city: string;
        country: string;
        company: string;
        VAT: string;
    };
    separateBilling: boolean;
    billing: {
        billingAddress: string;
        billingCity: string;
        billingCompany: string;
        billingCountry: string;
        billingEmail: string;
        billingName: string;
        billingPhone: string;
        billingVAT: string;
        billingZip: string;
    };
    comment: string;
    termsAndConditions: boolean;
    marketingEmails: boolean;
    order: Order;
    totalPrice: number;
}