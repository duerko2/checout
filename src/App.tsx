import {FormEvent, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'



function App() {
    return(
        <div className="App">
            <FetchProducts />
        </div>
    )
}

function FetchProducts() {
    const [ids, setProducts] = useState<string[]>([]);
    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        const URL = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product.json";
        const response = await fetch(URL);
        const jsonProducts = (await response.json()) as {
            products: { id: string, name: string, price: number, currency: String, rebateQuantity: number, rebatePercent: number, upsellProductId: String }[];
        };
        const {products} = jsonProducts

        setProducts(products.map(({id}) => id));
    }
    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">GO!</button>
            <p>Product id's:</p>
            <ol>
                {ids.map((id)=>(
                    <li>{id}</li>
                ))}
            </ol>
        </form>

    )
}

export default App
