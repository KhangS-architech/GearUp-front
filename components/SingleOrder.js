import styled from "styled-components"
import { format } from "date-fns"


const StyledOrder = styled.div`
    margin: 5px 0;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 20px;
    align-items: center;
    time{
        font-size: .8rem;
        color: #999;
    }
`;

const ProductRow = styled.div`
    span{
        color: #aaa;
    }
`;


export default function SingleOrder({line_items,createdAt}) {
    const formattedDate = format(new Date(createdAt), "dd/MM/yyyy hh:mm a")
    return (
        <StyledOrder>
            <div>
                <time>{formattedDate}</time>
            </div>
            <div>
                {line_items.map(item => (
                    <ProductRow>
                        <span>{item.quantity} x </span>
                        {item.price_data.product_data.name}
                    </ProductRow>
                ))}
            </div>
        </StyledOrder>
    )
}