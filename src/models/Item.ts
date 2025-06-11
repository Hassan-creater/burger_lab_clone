import { AddOn } from "@/types";

export type Item = {
    id: number;
    name: string;
    image: string;
    description?: string;
    price: number;
    category_id: number;
    status: number;
    cat_name: string;
    tags: string;
    addOns?: AddOn[];
}
