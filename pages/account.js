import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import SingleOrder from "@/components/SingleOrder";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import axios from "axios";
import {signIn, signOut, useSession} from "next-auth/react"
import { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
    p {
        margin: 2px;
    }
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
`;

export default function AccountPage() {
    const {data:session} = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [loaded, setLoaded] = useState(true)
    const [showSaveMessage, setShowSaveMessage] = useState(false)
    const [wishedProducts, setWishedProducts] = useState([])
    const [activeTab, setActiveTab] = useState('Đơn hàng')
    const [orders, setOrders] = useState([])
    function saveAddress() {
        const data = {name, email, phoneNumber, address}
        axios.put('/api/address', data)
    }
    const handleSave = () => {
        saveAddress();
        setShowSaveMessage(true);

        // Tạm thời hiển thị thông báo trong 2 giây rồi ẩn đi
        setTimeout(() => {
            setShowSaveMessage(false);
        }, 2000);
    };
    async function logOut() {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        })
    }
    async function logIn() {
        await signIn('google')
    }
    
    useEffect(() => {
            if(!session) {
                return
            }
            setLoaded(false)
            axios.get('/api/address').then(response => {
                setName(response.data.name)
                setPhoneNumber(response.data.phoneNumber)
                setEmail(response.data.email)
                setAddress(response.data.address)
                setLoaded(true)
            })
            axios.get('/api/wishlist').then(response => {
                setWishedProducts(response.data.map(wp => wp.product))
                setLoaded(true)
            })
            axios.get('/api/orders').then(response => {
                setOrders(response.data)
                setLoaded(true)
            })
        }, [session])
    function productRemoveFromWishList(idToRemove) {
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove )]
        })
    }
    return (
        <>
         <Header/>
         <Center>
            <ColsWrapper>
                <div>
                    <Box>
                        <Tabs tabs={['Đơn hàng','Danh sách yêu thích']} active={activeTab} onChange={setActiveTab}/>
                        {activeTab === 'Đơn hàng' && (
                            <>
                             {!loaded && (
                                <Spinner fullWidth={true}/>
                             )}
                             {loaded && (
                                <div>
                                    {orders.length === 0 && (
                                        <p>Đăng nhập để thấy đơn hàng</p>
                                    )}
                                    {orders.length > 0 && orders.map(o => (
                                        <SingleOrder {...o}/>
                                    ))}
                                </div>
                             )}
                            </>
                        )}
                        {activeTab === 'Danh sách yêu thích' && (
                            <>
                            {!loaded && (
                                <Spinner fullWidth={true}/>
                            )}
                            {loaded && (
                                <>
                                <WishedProductsGrid>
                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                        <ProductBox key={wp._id} {...wp} wished={true}
                                                            onRemoveFromWishList={productRemoveFromWishList} />
                                    ))}
                                </WishedProductsGrid>
                                {wishedProducts.length === 0  && (
                                        <>
                                         {session && (
                                            <p>Danh sách của bạn đang trống</p>
                                         )}
                                         {!session && (
                                            <p>Đăng nhập để thêm sản phẩm vào danh sách yêu thích</p>
                                         )}
                                        </>
                                    )}
                                </>  
                            )}           
                            </>
                        )}
                    </Box>
                </div>
                <div>
                    <Box>
                        <h2>{session ? 'Thông tin tài khoản' : 'Đăng nhập'}</h2>
                        {!loaded && (
                            <Spinner fullWidth={true}/>
                        )}
                        {loaded && session && (
                            <>
                                <Input type="text" placeholder="Bạn tên gì?" value={name} name ="name" onChange={ev=>setName(ev.target.value)}/>
                                <Input type="text" placeholder="Email" value={email} name="email" onChange={ev=>setEmail(ev.target.value)}/>
                                <Input type="text" placeholder="Số điện thoại" value={phoneNumber} name="phoneNumber" onChange={ev=>setPhoneNumber(ev.target.value)}/>
                                <Input type="text" placeholder="Địa chỉ nhận hàng" value={address} name="address" onChange={ev=>setAddress(ev.target.value)}/>
                                <Button black block onClick={handleSave}>Lưu</Button>
                                <hr/>
                            </>
                        )}
                        {session && (
                            <Button primary onClick={logOut}>Đăng xuất</Button>
                        )}
                        {!session && (
                            <Button primary onClick={logIn}>Đăng nhập bằng Google</Button>
                        )}
                    </Box>
                </div>
            </ColsWrapper>
            {showSaveMessage && (
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff", padding: "10px", position: "fixed", bottom: "20px", right: "20px", borderRadius: "5px" }}>
                    Thông tin đã được lưu!
                </div>
            )}
            
         </Center>
        </>
    )
}