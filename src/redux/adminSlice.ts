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

interface Category {
    id: string;
    category: string;
}

interface ProductUpd {
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

    formDataUpdateProduct: {
        product_name: string;
        category: string;
        product_status: string;
        description: string;
        price: string;
        quantity: string;
        product_image: string;
    };


    productupd: {
        id: string;
        product_name: string;
        category: string;
        product_status: string;
        description: string;
        price: string;
        quantity: string;
        product_image: string;
    };
    
    category:{
        id: string;
        category: string;
    }[];

    product_image: null;
    product_imageupd: null;
    errorAddProduct: Record<string, string>;
    errorUpdateProduct: Record<string ,string>;
} = {
    users: [],

    products: [],

    category:[],

    formDataAddProduct: {
        product_name: "",
        category: "",
        product_status: "",
        description: "",
        price: "",
        quantity: "",
    },

    formDataUpdateProduct: {
        product_name: "",
        category: "",
        product_status: "",
        description: "",
        price: "",
        quantity: "",
        product_image:""
    },

    productupd: {
        id: "",
        product_name: "",
        category: "",
        product_status: "",
        description: "",
        price: "",
        quantity: "",
        product_image: "",
    },

    product_image: null,
    product_imageupd: null,
    errorAddProduct: {},
    errorUpdateProduct:{},
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

        getProductCategory: (state, action: { payload: Category[] }) => {
            state.category = action.payload.map((category: Category) => ({
                id: category.id,
                category: category.category,
            }));
        },

        getProductUpd: (state, action: { payload: ProductUpd }) => {
            state.productupd = {
                id: action.payload.id,
                product_name: action.payload.product_name,
                category: action.payload.category,
                product_status: action.payload.product_status,
                description: action.payload.description,
                price: action.payload.price,
                quantity: action.payload.quantity,
                product_image: action.payload.product_image,
            };
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

        updateFormDataUpdateProduct: (state, action: { payload: { field: keyof typeof state.formDataUpdateProduct; value: string } }) => {
            const { field, value } = action.payload;
            state.formDataUpdateProduct[field] = value;
        },

        updateImage: (state, action) => {
            state.product_image = action.payload;
        },

        clearErrors: (state) => {
            state.errorAddProduct = {};
            state.errorUpdateProduct = {};
        },

        cleanFormData: (state) => {
            state.formDataAddProduct.product_name = "",
            state.formDataAddProduct.price = "",
            state.formDataAddProduct.quantity = "";
            state.formDataAddProduct.description = ""
            state.formDataAddProduct.category = "",
            state.formDataAddProduct.quantity = ""
            state.formDataAddProduct.product_status = ""
            // state.formDataUpdateProduct.product_name = "",
            // state.formDataUpdateProduct.price = "",
            // state.formDataUpdateProduct.quantity = "";
            // state.formDataUpdateProduct.description = ""
            // state.formDataUpdateProduct.category = "",
            // state.formDataUpdateProduct.quantity = ""
            // state.formDataUpdateProduct.product_status = ""
        },

        cleanImage : (state) => {
         state.product_image = null
        },

        setErrorsAddproduct: (state, action: { payload: Record<string, string> }) => {
            state.errorAddProduct = action.payload;
        },

        setErrorsUpdateProduct: (state, action: { payload: Record<string, string> }) => {
            state.errorUpdateProduct = action.payload;
        },

    },
});

export const { getUser, getProduct, getProductUpd, cleanImage, getProductCategory, updateFormDataAddProduct, updateFormDataUpdateProduct, updateImage, cleanFormData, clearErrors, setErrorsAddproduct, setErrorsUpdateProduct, deleteUser, deleteProduct } = adminSlice.actions;
export default adminSlice.reducer;
