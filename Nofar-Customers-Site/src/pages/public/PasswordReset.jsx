import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate, Link } from "react-router-dom";

const PasswordReset = () => {
  const { user, forgot } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    user_email: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await forgot(values.user_email);
      setValues({
        user_email: "",
      });
      toast.success(response.message);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
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
          Forget Password
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
        <Button type="submit" colorScheme="orange" size="lg" mb={4}>
          Send
        </Button>
      </Box>

      {loading && <span>loading...</span>}
    </>
  );
};

export default PasswordReset;
