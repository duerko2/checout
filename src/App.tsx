import {useState} from 'react'
import './App.css'
import React from 'react';



function App() {
    return(
        <div className="App">
            <FetchProducts />
        </div>
    )
}



function FetchProducts() {
    const [products, setProducts] = useState<{id: string, name: string,price: number, currency: String, rebateQuantity: number, rebatePercent: number, upsellProductId: string}[]>([]);
    async function onClick() {
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

    return (
        <div>
            <button onClick={onClick}>GO!</button>
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
                        <div className="grid-item">{product.price}</div>
                        <div className="grid-item">{product.rebatePercent}%</div>
                        <div className="grid-item">
                            <button className="unit-button">-</button>
                            <a>{product.rebateQuantity}</a>
                            <button className="unit-button">+</button>
                        </div>
                        <div className="grid-item">{product.price*product.rebatePercent*product.rebateQuantity}</div>

                    </div>
                ))}

        </div>

    )
}

export default App
