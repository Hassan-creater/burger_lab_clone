import { Branch } from "@/models/Branch";
import { Category } from "@/models/Category";
import { Item } from "@/models/Item";
import { Slides } from "@/models/Slides";
import axios from "axios";

const BACKEND_BASE_URL = 'http://localhost:3001';
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

export async function getAllBranches(){
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