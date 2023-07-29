import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  Input,
  Button,
  Heading,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const ForgotPassword = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();

  const customer_token = location.search.split("=")[1];

  const navigate = useNavigate();

  const [data2, setData] = useState(false);

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const userValid = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/emails/forgot-password/${id}`,
        {
          headers: {
            customer_token: customer_token,
          },
        }
      );

      if (data.status === 201) {
        console.log("user valid");
      } else {
        navigate("/");
        toast.error("Invalid Link");
      }
    } catch (error) {
      navigate("/");
      toast.error("Invalid Link");
    }
  };

  const sendPassword = async (e) => {
    e.preventDefault();

    if (password === "") {
      toast.error("Password is required!", {
        position: "top-center",
      });
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-center",
      });
    } else {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/emails/${id}`,
          {
            password,
            customer_token,
          }
        );

        if (data.status === 201) {
          setPassword("");
          setMessage(true);
        } else {
          toast.error("Token Expired, generate new Link!", {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error("An error occurred while updating the password!", {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    userValid();
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {data2 ? (
        <>
          {" "}
          <Box minH="65vh" maxW="600px" mx="auto" py={10} px={4}>
            <Heading as="h2" size="xl" mb={6}>
              Enter Your NEW Password
            </Heading>
            <section>
              <div className="form_data">
                <form>
                  {message ? (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      Password Successfully Updated
                    </p>
                  ) : null}
                  <div className="form_input">
                    <label htmlFor="password">New password</label>
                    <Input
                      my={5}
                      type="password"
                      value={password}
                      onChange={(e)=>{
                        setPassword(e.target.value)
                      }}
                      name="password"
                      id="password"
                      placeholder="Enter Your new password"
                    />
                  </div>

                  <Button mb={4} colorScheme="blue" onClick={sendPassword}>
                    Send
                  </Button>
                </form>
                <p>
                    <Divider/>
                  <Link to="/">
                    <Button mt={3} >Home</Button>
                  </Link>
                </p>
              </div>
            </section>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default ForgotPassword;
