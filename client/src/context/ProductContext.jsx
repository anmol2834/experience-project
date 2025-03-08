

import React, { createContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext';

export const context_of_product = createContext();

function ProductContext({children}) {

    const {token} = useAuth();
    
    const [productInfo, setProductInfo] = useState([]);

    useEffect(() => {
            const productData = async () => {
                try {
                    if (!token) return;
                    const res = await fetch("http://localhost:5000/products", {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': `application/json`
                        }
                    });
    
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
    
                    let data = await res.json()
                    setProductInfo(data)
    
                } catch (error) {
                    console.error(error)
                }
            }
            productData();
            
        }, [token])

  return (
    <context_of_product.Provider value={productInfo}>
        {children}
    </context_of_product.Provider>
  )
}

export default ProductContext
