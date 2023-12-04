import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.3fr .8fr;
    }
    gap: 20px;
    margin-top: 40px;
    margin-bottom: 40px;
    table thead tr th: nth-child(3),
    table tbody tr td: nth-child(3),
    table tbody tr.subtotal td: nth-child(2) {
        text-align: right;
    }
    table tr.subtotal td {
        padding: 15px 0;
    }
    table tbody tr.subtotal td: nth-child(2) {
        font-size: 1.4rem;
    }
    tr.total td {
        font-weight: bold;
    }
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width :120px;
    height: 150px;
    padding: 2px;
    img{
        max-width: 110px;
        max-height: 110px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        img{
            max-width: 130px;
            max-height: 130px;
            width :150px;
            height: 150px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

export default function CartPage() {
    const {cartProducts,addProduct,removeProduct,clearCart,updateLocalStorage} = useContext(CartContext)
    const {data:session} = useSession()
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [shippingFee, setShippingFee] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    useEffect(() => {
        if(cartProducts.length > 0) {
            axios.post('/api/cart', {ids:cartProducts})
            .then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([])
        }
    }, [cartProducts])
    useEffect(() => {
        if (typeof window === 'undefined') {
          return;
        }
      
        const urlParams = new URLSearchParams(window.location.search);
        const successParam = urlParams.get('success');
        if (successParam === '1') {
          setIsSuccess(true);
          clearCart();
          updateLocalStorage([])
        }
        axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value)
        })
      }, [isSuccess]); 
    
    useEffect(() => {
        if (!session) {
            return
        }
        axios.get('/api/address').then(response => {
            setName(response.data.name)
            setPhoneNumber(response.data.phoneNumber)
            setEmail(response.data.email)
            setAddress(response.data.address)
        })
    }, [session])
      
    function moreOfThisProduct(id) {
        addProduct(id)
    }

    function lessOfThisProduct(id) {
        removeProduct(id)
    }

    

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, email, phoneNumber, address,
            cartProducts,
        })
        if (response.data.url) {
            window.location = response.data.url
        }
    }

    let productsTotal = 0
    for(const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0
        productsTotal += price
    }


    if(isSuccess) {
        return (
            <>
            <Header/>
            <Center>
                <Box>
                    <h1>Thanh toán thành công!</h1>
                    <p>Chúng tôi sẽ liên hệ cho bạn khi đơn hàng của bạn đã sẵn sàng.</p>
                </Box>
            </Center>

            </>
        )
    }

    return(
        <>
            <Header/>
            <Center>
                <ColumnsWrapper>
                    <Box>
                    <h2>Giỏ hàng</h2>
                        {!cartProducts?.length && (
                            <div>Giỏ hàng của bạn đang trống</div>
                        )}
                        {products?.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product =>  (
                                       
                                        <tr>
                                             <ProductInfoCell>
                                                <ProductImageBox><img src={product.images[0]} alt=""/></ProductImageBox>
                                                {product.title}
                                             </ProductInfoCell>
                                             <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>{cartProducts.filter(id => id === product._id).length}</QuantityLabel>
                                                <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>
                                             <td>${(cartProducts.filter(id => id === product._id).length * product.price)}</td>
                                        </tr>

                                ) )}
                               
                            <tr className="subtotal">
                                <td colSpan={2}>Sản phẩm</td>
                                <td>${productsTotal}</td>
                            </tr>
                            <tr className="subtotal">
                                <td colSpan={2}>Phí vận chuyển</td>
                                <td>${shippingFee}</td>
                            </tr>
                            <tr className="subtotal total">
                                <td colSpan={2}>Tổng</td>
                                <td>${productsTotal + parseInt(shippingFee)}</td>
                            </tr>
                            </tbody>
                        </Table>
                        )}
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                        <h2>Thông tin đặt hàng</h2>
                        

                        
                        <Input type="text" placeholder="Tên người đặt" value={name} name ="name" onChange={ev=>setName(ev.target.value)}/>
                        <Input type="text" placeholder="Email" value={email} name="email" onChange={ev=>setEmail(ev.target.value)}/>
                        <Input type="text" placeholder="Số điện thoại" value={phoneNumber} name="phoneNumber" onChange={ev=>setPhoneNumber(ev.target.value)}/>
                        <Input type="text" placeholder="Địa chỉ nhận hàng" value={address} name="address" onChange={ev=>setAddress(ev.target.value)}/>
                        <Button black block onClick={goToPayment}>Thanh toán</Button>
                       
                    </Box>
                    )}
                    
                </ColumnsWrapper>
            </Center>
            
        </>
    )
}
