import {Item, OrderInfo, Zipcode} from "./types";
import "./styles/Delivery.css";
import React, {FormEvent, useEffect, useState} from "react";
import {getTotal} from "./OrderUtilityFunctions";
import {UserForm} from "./UserForm";
import {BasketGrid} from "./BasketGrid";
import {f} from "msw/lib/glossary-de6278a9";


export function Delivery({
                             order,
                             setOrderInfo,
                             navigate
                         }: { order: { itemList: Item[], recurring: boolean }, setOrderInfo: (orderInfo: OrderInfo) => void, navigate: () => void }) {


    async function postOrder(e: FormEvent) {
        e.preventDefault();
        order.itemList.forEach(item => {
            removeItemWhenQuantityZero(item);
        });
        if (order.itemList.length === 0) {
            return;
        }

        const target = e.target as typeof e.target & {
            name: { value: string };
            phone: { value: string };
            email: { value: string };
            address: { value: string };
            zip: { value: string };
            city: { value: string };
            country: { value: string };
            company?: { value: string };
            VAT?: { value: string };
            separateBilling: { checked: boolean };
            comment?: { value: string };
            termsConditions: { checked: boolean };
            marketingEmails: { checked: boolean };
            billingAddress?: { value: string },
            billingCity?: { value: string },
            billingCompany?: { value: string },
            billingCountry?: { value: string },
            billingEmail?: { value: string },
            billingName?: { value: string },
            billingPhone?: { value: string },
            billingVAT?: { value: string },
            billingZip?: { value: string },
        }
        console.log(target.name.value);


        setOrderInfo({
            delivery: {
                name: target.name.value,
                phone: target.phone.value,
                email: target.email.value,
                address: target.address.value,
                zip: target.zip.value,
                city: target.city.value,
                country: target.country.value,
                company: target.company?.value ?? "",
                VAT: target.VAT?.value ?? "",
            },
            separateBilling: target.separateBilling.checked,
            billing: {
                address: target.billingAddress?.value ?? "",
                city: target.billingCity?.value ?? "",
                company: target.billingCompany?.value ?? "",
                country: target.billingCountry?.value ?? "",
                email: target.billingEmail?.value ?? "",
                name: target.billingName?.value ?? "",
                phone: target.billingPhone?.value ?? "",
                VAT: target.billingVAT?.value ?? "",
                zip: target.billingZip?.value ?? "",
            },
            comment: target.comment?.value ?? "",
            termsAndConditions: target.termsConditions.checked,
            marketingEmails: target.marketingEmails.checked,
            order: order,
            totalPrice: getTotal(order)
        });
        console.log(order);
        console.log("når vi hertil")
        navigate()
    }


    function removeItemWhenQuantityZero(item: Item) {
        if (item.quantity <= 0) {
            order.itemList = order.itemList.filter((i: Item) => i !== item);
        }
    }

    return (<div className="right-side-form">
        <form aria-label="deliveryForm" name="delivery" onSubmit={postOrder}>

            <h3>Delivery information</h3>
            <UserForm isSignUp={false}/>
        </form>
    </div>)
}



/*
    const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
    const [separateBilling, setSeparateBilling] = useState<boolean>(false);
    const [cityText, setCityText] = useState<String>("");
    const [billingCityText, setBillingCityText] = useState<String>("");
    const [zipVisible, setZipVisible] = useState<Boolean>(false);
    const [billingZipVisible, setBillingZipVisible] = useState<Boolean>(false);


    function checkZip(inputZip: string) {
        if (inputZip === "") {
            setZipVisible(false);
            setCityText("");
        } else {
            for (let zipcode of zipcodes) {
                if (inputZip === zipcode.nr) {
                    setCityText(zipcode.navn);
                    setZipVisible(false);
                    break;
                } else {
                    setZipVisible(true);
                    setCityText("");
                }
            }
        }
    }

    useEffect(() => {
        async function fetchZip() {
            const URL = "https://api.dataforsyningen.dk/postnumre";
            try {
                const response = await fetch(URL);
                const result = (await response.json()) as Zipcode[];
                setZipcodes(result)
            } catch (e) {
                console.log(e)
            }
        }

        fetchZip();
    }, []);
*/



