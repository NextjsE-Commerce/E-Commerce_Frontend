import { createSlice } from "@reduxjs/toolkit";
import { Interface } from "readline";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string;
}

interface UserCart {
    id: string;
    product_name: string;
    product_status: string;
    quantity: string;
    price: string;
    image: string;
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

interface ProductDetail {
    id: string;
    product_name: string;
    category: string;
    product_status: string;
    description: string;
    price: string;
    quantity: string;
    product_image: string;
}

interface Shipping {
    id: string;
    location: string;
    price: string;
}

interface Category {
    category_name: string;
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


    productdetail: {
        id: string;
        product_name: string;
        category: string;
        product_status: string;
        description: string;
        price: string;
        quantity: string;
        product_image: string;
    };

    usercart: {
        id: string;
        product_name: string;
        product_status: string;
        quantity: string;
        price: string;
        image: string;
    }[];

    cartItem: { item_incart: number },
    isLoggedIn: boolean,

    category: {
        category_name: string,
    }[];

    shipping: {
        id: string;
        location: string;
        price: string;
    }[];

    formDataRegister: {
        firstName: string;
        lastName: string;
        email: string;
        sex: string;
        phone: string;
        password: string;
        password_confirmation: string;
        role: string;
    };
    formDataLogin: {
        email: string;
        password: string;
    };
    formDataGoogle: {
        email: string,
        firstName: string,
        lastName: string,
    },
    profilePicture: null;
    errorsRegister: Record<string, string>;
    errorsLogin: Record<string, string>;

} = {
    users: [],
    products: [],
    usercart: [],
    category: [],
    shipping: [],
    isLoggedIn: false,
    cartItem: {
        item_incart: 0
    },
    productdetail: {
        id: "",
        product_name: "",
        category: "",
        product_status: "",
        description: "",
        price: "",
        quantity: "",
        product_image: "",
    },
    formDataRegister: {
        firstName: "",
        lastName: "",
        sex: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role: "user",
    },
    formDataLogin: {
        email: "",
        password: "",
    },
    formDataGoogle: {
        email: "",
        firstName: "",
        lastName: "",
    },
    profilePicture: null,
    errorsRegister: {},
    errorsLogin: {},
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        getUser: (state, action: { payload: User[] }) => {
            state.users = action.payload.map((user: User) => ({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage,
            }));
        },

        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
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

        getUserCart: (state, action: { payload: UserCart[] }) => {
            state.usercart = action.payload.map((cart: UserCart) => ({
                id: cart.id,
                product_name: cart.product_name,
                product_status: cart.product_status,
                quantity: cart.quantity,
                price: cart.price,
                image: cart.image
            }));
        },

        getProductDetail: (state, action: { payload: ProductDetail }) => {
            state.productdetail = {
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

        getShipping: (state, action: { payload: Shipping[] }) => {
            state.shipping = action.payload.map((shipping: Shipping) => ({
                id: shipping.id,
                location: shipping.location,
                price: shipping.price
            }));
        },

        getItemInCart: (state, action: { payload: number }) => {
            state.cartItem.item_incart = action.payload;
        },

        getCategories: (state, action: { payload: Category[] }) => {
            state.category = action.payload.map((category: Category) => ({
                category_name: category.category_name
            }));
        },




        deleteUser: (state, action: { payload: { id: string } }) => {
            const id = action.payload.id;
            state.users = state.users.filter((u) => u.id !== id);
        },

        updateFormDataRegister: (state, action: { payload: { field: keyof typeof state.formDataRegister; value: string } }) => {
            const { field, value } = action.payload;
            state.formDataRegister[field] = value;
        },

        updateFormDataLogin: (state, action: { payload: { field: keyof typeof state.formDataLogin; value: string } }) => {
            const { field, value } = action.payload;
            state.formDataLogin[field] = value;
        },

        updateGoogleFormData: (state, action: { payload: { field: keyof typeof state.formDataGoogle; value: string } }) => {
            const { field, value } = action.payload;
            state.formDataGoogle[field] = value;
        },

        updateImage: (state, action) => {
            state.profilePicture = action.payload;
        },

        clearErrors: (state) => {
            state.errorsRegister = {};
            state.errorsLogin = {};
        },

        cleanFormData: (state) => {
            state.formDataRegister.firstName = "",
                state.formDataRegister.lastName = "",
                state.formDataRegister.sex = "";
            state.formDataRegister.email = ""
            state.formDataRegister.password = "",
                state.formDataRegister.phone = ""
            state.formDataRegister.password_confirmation = ""
        },

        setErrorsRegister: (state, action: { payload: Record<string, string> }) => {
            state.errorsRegister = action.payload;
        },

        setErrorsLogin: (state, action: { payload: Record<string, string> }) => {
            state.errorsLogin = action.payload;
        },
    },
});

export const { getUser, getProduct, getItemInCart, setIsLoggedIn, getShipping, getCategories, getUserCart, getProductDetail, updateFormDataRegister, updateFormDataLogin, updateGoogleFormData, updateImage, clearErrors, cleanFormData, setErrorsRegister, setErrorsLogin, deleteUser } = userSlice.actions;
export default userSlice.reducer;
