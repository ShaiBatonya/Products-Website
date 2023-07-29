// AuthContext.js
import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [cookies, setCookie, removeCookie] = useCookies(["customer_token"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (user_email, user_password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/customers/login`, {
        user_email,
        user_password
      });

      console.log(data);
      setUser(data.user);
      setCookie("customer_token", data.customer_token, { path: "/", maxAge: 10800 });
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/customers/logout`, {}, {
        headers: {
          Authorization: `Bearer ${cookies.customer_token}`
        }
      });

      removeCookie("customer_token");
      localStorage.removeItem("user")
      setUser(null);
      return {
        success: true,
        message: "Logout successful"
      };
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const register = async (values) => {
    try {
      const { user_name, user_email, user_password, user_phone } = values;
  
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/customers/register`, {
        user_name,
        user_email,
        user_password,
        user_phone: user_phone || ""
      });
  
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
  
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      throw new Error(error.response.data.error || "Error in registering user");
    }
  };


  const forgot = async (user_email) => {
    try {
  
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/emails/send-password-link`, {
        user_email
      });
  
/*       if (!response.data.success) {
        throw new Error(response.data.message);
      } */
  
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      throw new Error(error.response.data.error || "Error in registering user");
    }
  };
  

  useEffect(() => {
    const authUser = async () => {
      if (cookies.customer_token) {
        setLoading(true);
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/customers/auth`, {
            headers: {
              Authorization: `Bearer ${cookies.customer_token}`
            }
          });


          setUser(data.user);

          
        } catch (error) {
          removeCookie("customer_token");
          setUser(null);
          setError(error.response.data.error);
        } finally {
          setLoading(false);
        }
      }
    };

    authUser();
  }, [cookies, removeCookie]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = {
    user,
    setUser,
    login,
    logout,
    register,
    forgot,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
