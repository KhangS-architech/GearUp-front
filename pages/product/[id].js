import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import ProductReview from "@/components/ProductReview";
import Title from "@/components/Title";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext,useState } from "react";
import styled from "styled-components";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns:  1.1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.5fr 1.1fr;
    }
    gap: 40px;
    margin: 40px 0;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const PriceRow = styled.div`
    gap: 20px;
    display: flex;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.7rem;
`;

export default function ProductPage ({product}) {
    const {addProduct} = useContext(CartContext)
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);
    const handleAddToCart = () => {
        addProduct(product._id);
        setShowAddToCartMessage(true);

        // Tạm thời hiển thị thông báo trong 2 giây rồi ẩn đi
        setTimeout(() => {
            setShowAddToCartMessage(false);
        }, 2000);
    };
    return (
        <>
            <Header/>
            <Center>
                <ColWrapper>
                <Box>
                    <ProductImages images={product.images}/>
                </Box>
                <div>
                    <Title>{product.title}</Title>
                    <p>{product.description}</p>
                    <PriceRow>
                        <div>
                            <Price>${product.price}</Price>
                        </div>
                        <div>
                            <Button primary onClick={handleAddToCart}>
                                <CartIcon/>Thêm vào giỏ hàng
                            </Button>
                        </div>
                    </PriceRow>
                </div>
                </ColWrapper>
                <ProductReview product = {product}/>

            </Center>
            {showAddToCartMessage && (
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff", padding: "10px", position: "fixed", bottom: "20px", right: "20px", borderRadius: "5px" }}>
                    Sản phẩm đã được thêm vào giỏ hàng!
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect()
    const {id} = context.query
    const product = await Product.findById(id)
    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }
}
