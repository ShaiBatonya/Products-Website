import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
function PrivateRoutes ({ user }) {


  const [cookies] = useCookies(["customer_token"]);
  
  if(!user && !cookies.customer_token) {
    return <Navigate to="/" />
  }
  
  axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.customer_token}`;

  return <Outlet />
};

export default PrivateRoutes;

