import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useState } from "react";
import { mongooseConnect } from "@/lib/mongoose";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.2rem;
    @media screen and (min-width: 768px) {
        font-size: 1.9rem;
    }

`;

const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
    display : grid;
    grid-template-columns: 1fr;
    gap: 35px;
    img {
        max-width: 90%;
        max-height: 200px;
        display: block;
        margin: 0 auto;
    }
    div:nth-child(1) {
        order: 2;
        margin-left: auto;
        margin-right: auto;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: .9fr 1.1fr;
        & > div:nth-child(1) {
            order: 0;
        }
        img {
            max-width: 90%;
        }
    }
    
`;

const Columns = styled.div`
    display: flex;
    align-items : center;
`;

const ButtonWrapper = styled.div`
    display : flex;
    gap: 10px;
    margin-top: 25px;
`;

const CenterImg = styled.div`
    display : flex;
    align-items : center;
    justify-content: center;
`;

const ImgColumn = styled(Columns)`
    & > div{
        width: 100%;
    }
`;

const ContentWrapper = styled.div`

`;

export default function Featured ({product}) {
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
    const limitDescription = (description, limit) => {
        const words = description.split(' '); // Tách chuỗi thành mảng các từ
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...'; // Chỉ lấy 100 từ đầu tiên và kết thúc bằng dấu "..."
        } else {
            return description; // Trả về mô tả ban đầu nếu số từ không vượt quá giới hạn
        }
    };
    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Columns>
                        <div>
                            <ContentWrapper>
                                <Title>{product.title}</Title>
                                <Desc>
                                    {limitDescription(product.description, 100)}
                                </Desc>
                                <ButtonWrapper>
                                    <ButtonLink href={'/product/'+product._id} outline={1} white={1} >Xem thêm</ButtonLink>
                                    <Button white={1} onClick={handleAddToCart}>
                                        <CartIcon/>
                                         Mua ngay 
                                    </Button>
                                </ButtonWrapper>
                            </ContentWrapper>
                        </div>
                        
                    </Columns>
                    <ImgColumn>
                        <CenterImg>
                            <img src={product.images?.[0]} alt="" />
                        </CenterImg>
                    </ImgColumn>
                </ColumnsWrapper>
                
            </Center>
            {showAddToCartMessage && (
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff", padding: "10px", position: "fixed", bottom: "20px", right: "20px", borderRadius: "5px" }}>
                    Sản phẩm đã được thêm vào giỏ hàng!
                </div>
            )}
        </Bg>
    )
}