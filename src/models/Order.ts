
type Item = {
    id: string;
    qty: string;
    price: string;
}

export type Order = {
    orderId: number;
    userId: string;
    total: string;
    addressid: string;
    items: Item[];
    tax: string;
    deliveryCharge: string;
    comment: string;
}

export type OrderDetails = {
    order_id: number;
    status: string;
    user_name: string;
    user_phone: string;
    user_address_line1: string | null;
    user_address_line2: string | null;
    user_address_city: string | null;
    user_address_country: string | null;
    comment: string;
    discount: number;
    order_created_on: string | null;
    order_returned_on: string | null;
    order_completed_on: string | null;
    order_total: number;
    items: {
        item_name: string;
        item_price: number;
        item_qty: number;
    }[];
    returned_reason: string | null;
};

export type OrderItem = {
    id: number;
    userid: number;
    items: string;
    order_created_on: string | null;
    order_completed_on: string | null;
    order_returned_on: string | null;
    order_total: number;
    total: string;
    status: string;
    deliveryCharge: string;
    tax: string;
    discount: string;
}

export type OrderResult = {
    orders: OrderItem[];
    currentPage: number;
    totalPages: number;
}