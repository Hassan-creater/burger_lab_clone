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
    message: string;
    discount?: undefined;
    couponId?: undefined;
} | {
    valid: boolean;
    discount: any;
    couponId: any;
    message?: undefined;
}