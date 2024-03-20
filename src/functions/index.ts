import { Address } from "@/models/Address";
import { Branch } from "@/models/Branch";
import { Category } from "@/models/Category";
import { CouponValidation } from "@/models/Coupon";
import { Favorite } from "@/models/Favorites";
import { Item } from "@/models/Item";
import { Order, OrderDetails, OrderResult } from "@/models/Order";
import { Slides } from "@/models/Slides";
import { Social } from "@/models/Social";
import { CartItem, SearchResults } from "@/types";
import axios from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export async function getAllCategories() {
    try {
        const response = await axios.get<Category[]>(
            `${BACKEND_BASE_URL}/category/get`
        );
        return {
            status: response.status,
            categories: response.data
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            categories: null
        }
    }
}

export async function getAllSlides() {
    try {
        const response = await axios.get<Slides[]>(
            `${BACKEND_BASE_URL}/slide/get`
        );
        return {
            status: response.status,
            slides: response.data
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            slides: null
        }
    }
}

export async function getItemsByCategory(categoryId: number) {
    try {
        const response = await axios.get<Item[]>(
            `${BACKEND_BASE_URL}/item/getByCategory/${categoryId}`
        );
        return {
            status: response.status,
            items: response.data
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            items: null
        }
    }
}

export async function getAllBranches() {
    try {
        const response = await axios.get<Branch[]>(
            `${BACKEND_BASE_URL}/branch/get`
        );
        return {
            status: response.status,
            branches: response.data
        };
    } catch (error) {
        return {
            status: 500,
            branches: null
        }
    }
}

export async function getItemsByTag(query: string) {
    try {
        const response = await axios.get<SearchResults>(
            `${BACKEND_BASE_URL}/api/search/${query}`
        );
        return {
            status: response.status,
            items: response.data.items
        };
    } catch (error) {
        return {
            status: 500,
            items: null
        }
    }
}

export async function getItemById(id: number) {
    try {
        const response = await axios.get<Item>(
            `${BACKEND_BASE_URL}/item/get/${id}`,
        )

        return {
            status: response.status,
            item: response.data
        }
    } catch (error) {
        return {
            status: 500,
            item: null
        }
    }
}

export async function getAllFavorites(userId: number) {
    try {
        const response = await axios.post<Favorite[]>(`${BACKEND_BASE_URL}/favorite/user`,
            {
                platform: 'mobile',
                userid: userId
            }
        )
        return {
            status: response.status,
            favorites: response.data
        }
    } catch (error) {
        return {
            status: 500,
            favorites: null
        }
    }
}

export async function addFavorite(userId: number, itemId: number) {
    try {
        const response = await axios.post<Favorite>(
            `${BACKEND_BASE_URL}/favorite/add`,
            {
                platform: 'mobile',
                userid: userId,
                itemid: itemId,
            },
        )

        return {
            status: response.status,
            favorite: response.data
        }
    } catch (error) {
        return {
            status: 500,
            favorite: null
        }
    }
}

export async function removeFavorite(userId: number, itemId: number) {
    try {
        const response = await axios.post(
            `${BACKEND_BASE_URL}/favorite/delete`,
            {
                platform: 'mobile',
                userid: userId,
                itemid: itemId,
            }
        )

        return {
            status: response.status,
            message: response.data
        }
    } catch (error) {
        return {
            status: 500,
            message: 'Could not delete Favorite'
        }
    }
}

export async function addAddress(userId: number, addressLine1: string, addressLine2: string, city: string) {
    const response = await axios.post<Address>(
        `${BACKEND_BASE_URL}/address/add`,
        {
            platform: 'mobile',
            userid: userId,
            city,
            line1: addressLine1,
            line2: addressLine2,
        }
    )
    return {
        status: response.status,
        address: response.data
    }
}

export async function getAllAddresses(userId: number) {
    try {
        const response = await axios.get<Address[]>(
            `${BACKEND_BASE_URL}/address/user/${userId}`
        )

        return {
            status: response.status,
            addresses: response.data
        }
    } catch (error) {
        return {
            status: 500,
            addresses: null,
        }
    }
}

export async function deleteAddress(addressId: number) {
    try {
        const response = await axios.post(
            `${BACKEND_BASE_URL}/address/delete`,
            {
                platform: 'mobile',
                id: addressId,
            }
        )

        return {
            status: response.status,
            message: response.data?.message
        }
    } catch (error) {
        return {
            status: 500,
            message: 'Failed to delete address',
        }
    }
}

export async function updateAddress(addressId: number, addressLine1: string, addressLine2: string, city: string) {
    try {
        const response = await axios.post<Address>(
            `${BACKEND_BASE_URL}/address/update`,
            {
                platform: 'mobile',
                id: addressId,
                city,
                line1: addressLine1,
                line2: addressLine2,
            }
        )
        return {
            status: response.status,
            address: response.data
        }
    } catch (error) {
        return {
            status: 500,
            address: null
        }
    }

}

export async function getTax() {
    try {
        const response = await axios.get<{ tax: string }>(
            `${BACKEND_BASE_URL}/company/tax`
        )

        return {
            status: response.status,
            tax: response.data.tax
        }
    } catch (error) {
        return {
            status: 500,
            tax: '0',
        }
    }
}

export async function validateCoupon(promoCode: string, userId: number) {
    try {
        const response = await axios.post<CouponValidation>(
            `${BACKEND_BASE_URL}/coupon/validate-coupon`,
            {
                couponCode: promoCode,
                userid: userId
            }
        )

        return {
            status: response.status,
            validation: response.data
        }
    } catch (error) {
        return {
            status: 500,
            validation: 'Failed to apply Coupon'
        }
    }
}

export async function placeOrder(total: number, tax: string, deliveryCharges: string, comment: string, discount: string, userId: number, couponId?: string | number, addressId?: string, items: CartItem[] = []) {
    try {
        const response = await axios.post<Order>(
            `${BACKEND_BASE_URL}/order/place`,
            {
                total,
                addressid: addressId,
                tax,
                del: deliveryCharges,
                comment,
                discount,
                couponid: couponId ?? null,
                userid: userId,
                platform: 'mobile',
                "itemId[]": items.map((item) => item.id),
                "itemQty[]": items.map((item) => item.quantity ?? 1),
                "itemPrice[]": items.map((item) => item.totalPerPriceWithAddOns),
            }
        )
        return {
            status: response.status,
            order: response.data
        }
    } catch (error) {
        return {
            status: 500,
            order: null
        }
    }
}

export async function getOrders(userId: number, page: number = 1, limit: number = 10) {
    try {
        const response = await axios.post<OrderResult>(
            `${BACKEND_BASE_URL}/order/byUserIdPage`,
            {
                userid: userId,
                page,
                rowsPerPage: limit
            }
        )

        return {
            status: response.status,
            orders: response.data
        }
    } catch (error) {
        return {
            status: 500,
            orders: null
        }
    }
}

export async function getOrder(orderId: number) {
    try {
        const response = await axios.get<OrderDetails[]>(
            `${BACKEND_BASE_URL}/order/byOrderId/${orderId}`
        )

        return {
            status: response.status,
            order: response.data[0]
        }
    } catch (error) {
        return {
            status: 500,
            order: null
        }
    }
}

export async function getSocials() {
    try {
        const response = await axios.get<{ success: boolean, links: Social[] }>(
            `${BACKEND_BASE_URL}/company/social-media`
        )
        return {
            status: response.status,
            links: response.data?.links
        }
    } catch (error) {
        return {
            status: 500,
            links: null
        }
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await axios.post<{ message: string, status: string, isVerified: boolean }>(
            `${BACKEND_BASE_URL}/auth/login`,
            {
                email,
                password,
                platform: "mobile"
            }
        )

        return {
            status: response.status,
            user: response.data
        }
    } catch (error) {
        return {
            status: 500,
            user: null,
        }
    }
}

// export async function register()

export async function checkLoginStatus() {
    try {
        const response = await axios.get<{ status: boolean }>(
            `${BACKEND_BASE_URL}/login_status`
        )

        return {
            status: response.status,
            isLoggedIn: response.data.status
        }
    } catch (error) {
        return {
            status: 500,
            isLoggedIn: false
        }
    }
}