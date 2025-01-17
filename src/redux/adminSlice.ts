import { createSlice } from "@reduxjs/toolkit";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string;
}

interface Products {
    id: string;
    product_name: string;
    category: string;
    product_status: string;
    description: string;
    price: string;
    quantity: string;
    product_image: string;
}

const initialState: {
    users: { id: string; firstName: string; lastName: string; email: string; phone: string; profileImage: string }[];

    products: {
        id: string;
        product_name: string;
        category: string;
        product_status: string;
        description: string;
        price: string;
        quantity: string;
        product_image: string;
    }[];

    formDataAddProduct: {
        product_name: string;
        category: string;
        product_status: string;
        description: string;
        price: string;
        quantity: string;
    };
    product_image: null;
    errorAddProduct: Record<string, string>;
} = {
    users: [],
    products: [],
    formDataAddProduct: {
        product_name: "",
        category: "",
        product_status: "",
        description: "",
        price: "",
        quantity: "",
    },

    product_image: null,
    errorAddProduct: {},
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        getUser: (state, action: { payload: User[] }) => {
            state.users = action.payload.map((user: User) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage,
            }));
        },

        getProduct: (state, action: { payload: Products[] }) => {
            state.products = action.payload.map((products: Products) => ({
                id: products.id,
                product_name: products.product_name,
                category: products.category,
                product_status: products.product_status,
                description: products.description,
                price: products.price,
                quantity: products.quantity,
                product_image: products.product_image,
            }));
        },

        deleteUser: (state, action: { payload: { id: string } }) => {
            const id = action.payload.id;
            state.users = state.users.filter((u) => u.id !== id);
        },

        deleteProduct: (state, action: { payload: { id: string } }) => {
            const id = action.payload.id;
            state.products = state.products.filter((u) => u.id !== id);
        },

        updateFormDataAddProduct: (state, action: { payload: { field: keyof typeof state.formDataAddProduct; value: string } }) => {
            const { field, value } = action.payload;
            state.formDataAddProduct[field] = value;
        },

        updateImage: (state, action) => {
            state.product_image = action.payload;
        },

        clearErrors: (state) => {
            state.errorAddProduct = {};
        },

        cleanFormData: (state) => {
            state.formDataAddProduct.product_name = "",
            state.formDataAddProduct.price = "",
            state.formDataAddProduct.quantity = "";
            state.formDataAddProduct.description = ""
            state.formDataAddProduct.category = "",
            state.formDataAddProduct.quantity = ""
            state.formDataAddProduct.product_status = ""
        },

        setErrorsAddproduct: (state, action: { payload: Record<string, string> }) => {
            state.errorAddProduct = action.payload;
        },

    },
});

export const { getUser, getProduct, updateFormDataAddProduct, updateImage, cleanFormData, clearErrors, setErrorsAddproduct, deleteUser, deleteProduct } = adminSlice.actions;
export default adminSlice.reducer;
