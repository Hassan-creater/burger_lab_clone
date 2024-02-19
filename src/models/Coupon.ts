export type Coupon = {
    id: number;
    code: string;
    discount: number;
    expiryDate: string;
    createdOn: string;
    status: number;
}

export type CouponValidation = {
    valid: boolean;
    discount: number;
    couponId: number;
}