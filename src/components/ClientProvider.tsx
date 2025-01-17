'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider>
        <ToastContainer position="top-right" autoClose={5001} />
        <Provider store={store}>{children}</Provider>
    </SessionProvider>;
};

export default ClientProvider;
