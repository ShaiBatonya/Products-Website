import { useContext, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Root from "./pages/Root";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthContext } from "./context/AuthContext";

const About = lazy(() => import("./pages/public/About"));

import Contact from "./pages/public/Contact";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";

import Products from "./pages/public/products/Products";
import Product from "./pages/public/products/Product";
import { getAllProducts } from "./pages/public/products/Products";

import Orders from "./pages/private/Orders";
import Profile from "./pages/private/Profile";

import Purchase from "./pages/public/Purchase";
import NotFound from "./pages/public/NotFound";
import ForgotPassword from "./pages/public/ForgotPassword";
import PasswordReset from "./pages/public/PasswordReset";

function App() {
  const { user, setUser } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index loader={getAllProducts} element={<Products />} />
        <Route path="product/:id" element={<Product />} />
        <Route
          path="about"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          }
        />
        <Route path="contact" element={<Contact />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="purchase" element={<Purchase user={user} />} />

        <Route element={<PrivateRoutes user={user} />}>
          <Route path="orders" element={<Orders user={user} />} />
          <Route
            path="profile"
            element={<Profile setUser={setUser} user={user} />}
          />
        </Route>
        <Route path="password-reset" element={<PasswordReset />} />
        <Route
          path="forgot-password/:id"
          element={<ForgotPassword user={user} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
