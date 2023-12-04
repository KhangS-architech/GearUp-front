import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import axios from "axios";
import React ,{ useEffect, useState, useRef } from "react";

import styled from "styled-components";

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    margin: 30px 0 30px;
    font-size: 1.4rem;
    position: sticky;
    top: 5px;
`;

export default function SearchPage() {
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const delayedSearch = useRef(null);

    const handleSearch = (searchPhrase) => {
        setIsLoading(true);
        setError(false);
        axios.get('/api/products?phrase=' + encodeURIComponent(searchPhrase))
            .then(response => {
                setProducts(response.data);
                setError(false);
            }).catch(error => {
                setError(true);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (delayedSearch.current) {
            clearTimeout(delayedSearch.current);
        }

        if (phrase.length === 0) {
            setProducts([]);
        } else if (phrase.length > 0 && !phrase.includes('\\')){
            delayedSearch.current = setTimeout(() => {
                handleSearch(phrase);
            }, 0);
        }

        return () => {
            if (delayedSearch.current) {
                clearTimeout(delayedSearch.current);
            }
        };
    }, [phrase]);

    return (
        <>
         <Header/>
         <Center>
            <SearchInput 
             value={phrase}
             onChange={ev => setPhrase(ev.target.value)}
             autoFocus 
             placeholder="Bạn cần tìm gì?"/>
            {isLoading && (
                <h2>Đang tải...</h2>
            )}
            {!isLoading && products.length === 0 && phrase.length > 0 && !error &&  (
                    <h2>Không có sản phẩm nào...</h2>
                )}
            {!isLoading && products.length > 0 && <ProductsGrid products={products} />}
         </Center>
        </>
    )
}