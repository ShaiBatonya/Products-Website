import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    user_email: "",
    user_password: ""
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(values.user_email, values.user_password);
      debugger

      toast.success(response.message);
      navigate("/");
    } catch (error) {
      debugger
      toast.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  if(user) {
    return <Navigate to="/"/>
  }

  return (
    <>
      <Box
        as="form"
        onSubmit={handleSubmit}
        minH="65vh"
        maxW="600px"
        mx="auto"
        py={10}
        px={4}
      >
        <Heading as="h2" size="xl" mb={6}>
          Login
        </Heading>
        <FormControl id="email" isRequired mb={4}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email address"
            name="user_email"
            value={values.user_email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="password" isRequired mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            name="user_password"
            value={values.user_password}
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="orange" size="lg" mb={4}>
          Login
        </Button>
        <Text>
          Don't have an account?{" "}
          <Link style={{
            fontWeight:"bold",
            color:"blue",
            textDecoration:"underline"
          }} to="/register">
            Register
          </Link>
        </Text>
        <Text>
          Forgot password?{" "}
          <Link style={{
            fontWeight:"bold",
            color:"blue",
            textDecoration:"underline"
          }} to="/password-reset">
            Click Here
          </Link>
        </Text>
      </Box>

      {loading && <span>loading...</span>}
    </>
  );
};

export default Login;
