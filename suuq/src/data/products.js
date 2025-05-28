import axios from 'axios';


export async function getProducts() {
    const response = await axios.get('http://localhost:5000/api/data/products')

    if(!response){
       throw new Error('Failed to fetch products');
    }

    const data = response.data;
    return data;
}
