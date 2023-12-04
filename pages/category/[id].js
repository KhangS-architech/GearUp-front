import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { authOptions } from "../api/auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1{
        font-size:1.5em;
    }
`;

const FiltersWrapper = styled.div`
    display: flex;
    gap: 15px;
`;

const Filter = styled.div`
    background-color: #ddd;
    padding: 5px 25px;
    border-radius: 5px;
    display: flex;
    gap: 2px;
    color: #444;
    font-size: .6em;
    margin-top: 10px;
    margin-bottom: 20px;
    select {
        background-color: transparent;
        border: 0;
        font-size: .9em;
        color: #444;
    }
`;


export default function CategoryPage({category,subCategories,products:originalProducts,wishedProducts=[]}) {
    const [products,setProducts] = useState(originalProducts)
    const [filtersValues, setFiltersValues] = useState(category.properties.map(p => ({name: p.name, value:'all'})))
    const [sort, setSort] = useState('price_desc')
    const [loadingProducts, setLoadingProducts] = useState(false)
    function handleFilterChange(filterName, filterValue) {
        setFiltersValues(prev => {
            return prev.map(p => ({
                name: p.name,
                value: p.name === filterName ? filterValue : p.value,
            }))
        })
    }
    useEffect(() => {
        setLoadingProducts(true)
        const catIds = [category._id, ...(subCategories?.map(c => c._id) || [])]
        const params = new URLSearchParams
        params.set('categories',catIds.join(','))
        params.set('sort', sort)
        filtersValues.forEach(f => {
            if (f.value !== 'all') {
                params.set(f.name, f.value)
            }         
        });
        const url = `/api/products?` + params.toString()
        axios.get(url).then(res => {
            setProducts(res.data)
            setTimeout(() => {
                setLoadingProducts(false)
            },500)
        })

    }, [filtersValues,sort])
    
    return (
        <>
        <Header/>
        <Center>
            <CategoryHeader>
                <h1>{category.name}</h1>
            </CategoryHeader>
            <FiltersWrapper>
                    {category.properties.map(prop => (
                    <Filter key={prop.name}>
                        <span>{prop.name}:</span>
                        <select 
                         onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                         value={filtersValues.find(f => f.name === prop.name).value}>
                            <option value="all">Tất cả</option>
                            {prop.values.map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>
                    </Filter>
                    ))}
                    <Filter>
                        <span>Xếp theo:</span>
                        <select value={sort} onChange={ev => setSort(ev.target.value)}>
                            <option value="price_asc">Giá, thấp nhất</option>
                            <option value="price_desc">Giá, cao nhất</option>
                        </select>
                    </Filter>
                </FiltersWrapper>
                {loadingProducts && (
                    <Spinner fullWidth/>
                )}
                {!loadingProducts && (
                    <div>
                        {products.length > 0 && (
                            <ProductsGrid products={products} wishedProducts={wishedProducts}/>
                        )}
                        {products.length === 0 && (
                            <div>Không tìm thấy sản phẩm phù hợp</div>
                        )}
                    </div>
                )}
        </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect()
    const category = await Category.findById(context.query.id)
    const subCategories = await Category.find({parent:category._id})
    const catIds = [category._id, ...subCategories.map(c => c._id)]
    const products = await Product.find({category:catIds})
    const allFetchedProductsId = []
    allFetchedProductsId.push(...products.map(p => p._id.toString()))
    const session = await getServerSession(context.req, context.res, authOptions)
    const wishedProducts = session?.user 
        ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: allFetchedProductsId,
        }) : []
    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        }
    }
}