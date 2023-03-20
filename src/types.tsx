export type {Product,Zipcode,Item,Order};

type Product = {
    id: string;
    name: string;
    price: number;
    currency: string;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: string;
};

type Zipcode = {
    href: string;
    nr: string;
    navn: string;
    bigreceiver: string;
    bbox: Array<number>;
    visual: Array<number>;
    commune: { [key: string]: string};
    changedDate: string;
    locationChangedDate: string;
    locationVersion: number;
    dagi_id: string;


}

type Item ={ product: Product; quantity: number; giftWrap: boolean };
type Order = { itemList:Item[]; recurring: boolean };