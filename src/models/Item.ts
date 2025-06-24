import { AddOn } from "@/types";

export type Item = {
    id: string;
    name: string;
    image: string;
    description?: string;
    price: number;
    categoryId: string;
    status: string;
    categoryName: string;
    tags: string;
    addOns?: AddOn[];
}
