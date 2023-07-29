import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider } from "@chakra-ui/react";
import CartProvider from "./context/CartContext";
import {AuthProvider} from "./context/AuthContext";

import {startToolkit} from './accessibility.bundle';

startToolkit();

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <AuthProvider>
      <CartProvider>
        <ToastContainer />
        <App />
      </CartProvider>
    </AuthProvider>
  </ChakraProvider>
);
