import { createContext, useEffect, useState } from "react";


export const CartContext = createContext({})

export function CartContextProvider({children}) {
    const ls = typeof window !== "undefined" ? window.localStorage : null
    const [cartProducts,setCartProducts] = useState ([])
    
    useEffect(() => {
        if(cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts))
        }
    }, [cartProducts])
   

    useEffect(() => {
        if(ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')))
        }
    } ,[])

    function updateLocalStorage(cart) {
        if (ls) {
            ls.setItem('cart', JSON.stringify(cart));
        }
    }

    function addProduct(productId) {
        setCartProducts(prev => [...prev,productId])
        updateLocalStorage([...cartProducts, productId])
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId)
            if (pos !== -1) {
                return prev.filter((value,index) => index !== pos)
            }
            return prev 
        })
        updateLocalStorage([])
    }

    function clearCart() {
        setCartProducts([])
    }

    return (
        <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart,updateLocalStorage}}>
            {children}
        </CartContext.Provider>
    )
}