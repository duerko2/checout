import {useState} from 'react'
import './App.css'
import React from 'react';



function App() {
    return(
        <div className="basket">
            <Basket />
        </div>
    )
}

function Basket() {
    const [products, setProducts] = useState<{id: string, name: string,price: number, currency: String, rebateQuantity: number, rebatePercent: number, upsellProductId: string}[]>([]);
    fetchProducts();
    async function fetchProducts() {
        const URL = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product.json";
        try {
            const response = await fetch(URL);
            const result = (await response.json()) as {id: string, name: string, price: number, currency: String, rebateQuantity: number, rebatePercent: number, upsellProductId: string}[];

            let products : {id: string, name: string, price: number, currency: String, rebateQuantity: number, rebatePercent: number, upsellProductId: string}[] = [];
            for(let i=0;i<result.length;i++){
                products.push(result[i])
            }
            setProducts(products.map(e =>e));

        } catch(e){
            console.log(e)
        }
    }
    function getAverageProductPrice(){

    }

    function less(product: { id: string; name: string; price: number; currency: String; rebateQuantity: number; rebatePercent: number; upsellProductId: string }) {

        let newProducts=products.map(e=>e);
        for(let i=0;i<products.length;i++){
            if(products[i].rebateQuantity===0){
            } else if(products[i].id===product.id){
                newProducts[i].rebateQuantity--;
            }
        }
        setProducts(newProducts);
    }

    function more(product: { id: string; name: string; price: number; currency: String; rebateQuantity: number; rebatePercent: number; upsellProductId: string }) {
        let newProducts=products.map(e=>e);
        for(let i=0;i<products.length;i++){
            if(products[i].id===product.id){
                newProducts[i].rebateQuantity++;
            }
        }
        setProducts(newProducts);
    }

    function getTotal() {
        let total : number = 0;
        products.forEach(p=>total+=p.price*(1-p.rebatePercent*(1/100))*p.rebateQuantity);
        return total;
    }

    return (
        <div>
            <p>Basket</p>
                {products.map((product)=>(
                    <div key={product.id} className="product-grid">

                        <div className="grid-title">Product ID</div>
                        <div className="grid-title">Product Name</div>
                        <div className="grid-title">Unit Price</div>
                        <div className="grid-title">Discount</div>
                        <div className="grid-title">Units</div>
                        <div className="grid-title">Total Price</div>

                        <div className="grid-item">{product.id}</div>
                        <div className="grid-item">{product.name}</div>
                        <div className="grid-item">{product.price} {product.currency}</div>
                        <div className="grid-item">{product.rebatePercent}%</div>
                        <div className="grid-item">
                            <button className="unit-button" onClick={ () => less(product) }>-</button>
                            <a>{product.rebateQuantity}</a>
                            <button className="unit-button" onClick={ () => more(product) }>+</button>
                        </div>
                        <div className="grid-item">{(product.price*(1-product.rebatePercent*(1/100))*product.rebateQuantity).toFixed(2)} {product.currency}</div>

                    </div>
                ))}
            <div className="grand-total">
                <p>GRAND TOTAL: {getTotal().toFixed(2) } {products[0]?.currency}</p>
            </div>


        </div>

    )
}


export default App
