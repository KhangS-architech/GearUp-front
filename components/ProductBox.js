import styled from "styled-components"
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import Link from "next/link";
import { useContext} from "react";
import { CartContext } from "./CartContext";
import { useState } from "react";
import HeartOutlineIcon from "./icons/HeartOutLineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";
import { useSession } from "next-auth/react";

const ProductWrapper = styled.div`
    
`;


const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 10px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:10px;
    position: relative;
    img{
        max-width: 150%;
        max-height: 120px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: .9rem;
    color: inherit;
    text-decoration: none;
    margin: 0;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1.2rem;
    font-weight:bold;
`;

const WishlistButton = styled.button`
    border: 0;
    width: 40px;
    height: 40px;
    padding: 10px;
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    cursor: pointer;
    ${props => props.wished ? `
        color: red;
    ` :`
        color: black;
    `}
    svg{
        width: 16px;
    }
`;

export default function ProductBox({_id,title,description,price,images,wished=false,onRemoveFromWishList=() => {},}) {
    const {addProduct} = useContext(CartContext)
    const {data:session} = useSession()
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);
    const handleAddToCart = () => {
        addProduct(_id);
        setShowAddToCartMessage(true);

        // Tạm thời hiển thị thông báo trong 2 giây rồi ẩn đi
        setTimeout(() => {
            setShowAddToCartMessage(wished);
        }, 2000);
    };
    const truncatedTitle = title.length > 23 ? `${title.substring(0, 20)}...` : title;
    const url = '/product/'+_id
    const [isWished, setIsWished] = useState(wished);
    function addToWishList(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        const nextValue = !isWished
        if (nextValue === false && onRemoveFromWishList) {
            onRemoveFromWishList(_id)
        }
        axios.post('/api/wishlist',{
            product: _id,
        }).then(() => {})
        setIsWished(nextValue)
    }
    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                {session && (
                        <WishlistButton wished={isWished} onClick={addToWishList}>
                            {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
                        </WishlistButton>
                    )}
                    <img src={images[0]} alt=""/>
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{truncatedTitle}</Title>
                <PriceRow>
                    <Price>
                        ${price}
                    </Price>
                    
                    <Button onClick={handleAddToCart} primary outline>
                        <CartIcon/>
                    </Button>
                    
                </PriceRow>
            </ProductInfoBox>
            {showAddToCartMessage && (
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff", padding: "10px", position: "fixed", bottom: "20px", right: "20px", borderRadius: "5px" }}>
                    Sản phẩm đã được thêm vào giỏ hàng!
                </div>
            )}
        </ProductWrapper>
        
    )
}
