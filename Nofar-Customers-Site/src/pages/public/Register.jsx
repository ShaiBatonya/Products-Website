// Register.js
import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { user, register } = useContext(AuthContext);
  const [values, setValues] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_password_confirm: ""
  });

  const handleChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (values.user_password !== values.user_password_confirm) {
        throw new Error("Passwords don't match");
      }
      const response = await register(values);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      minH="65vh"
      maxW="600px"
      mx="auto"
      py={10}
      px={4}
    >
      <Heading as="h1" size="xl" mb={6}>
        Register
      </Heading>
      <FormControl isRequired mb={4}>
        <FormLabel>Your Name</FormLabel>
        <Input
          name="user_name"
          type="text"
          placeholder="Enter your name"
          value={values.user_name}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="user_email"
          type="email"
          placeholder="Enter your email address"
          value={values.user_email}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel>Password</FormLabel>
        <Input
          name="user_password"
          type="password"
          placeholder="Enter your password"
          value={values.user_password}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel>Password Again</FormLabel>
        <Input
          name="user_password_confirm"
          type="password"
          placeholder="Enter your password"
          value={values.user_password_confirm}
          onChange={handleChange}
        />
      </FormControl>
      <Button type="submit" colorScheme="orange" size="lg" mb={4}>
        Register
      </Button>
      <Text>
          already have an account?{" "}
          <Link style={{
            fontWeight:"bold",
            color:"blue",
            textDecoration:"underline"
          }} to="/login">
            Login
          </Link>
        </Text>
    </Box>
  );
};

export default Register;
