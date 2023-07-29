import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
const PurchasePage = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [payment, setPayment] = useState(null);

  const [paymentsValues, setPaymentValues] = useState({
    credit: "",
    exp: "",
    cvv: "",
  });

  const [values, setValues] = useState({
    name: user?.user_name || "",
    email: user?.user_email || "",
    phone: user?.user_phone || "",
    street: user?.user_address?.street || "",
    city: user?.user_address?.city || "",
    building: user?.user_address?.building || "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const continuePlaceOrder = async () => {
    try {

      const end_point = user? 'add-for-registered-users' : 'add';

      
      const { data: order_status } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/orders/${end_point}`,
        {
          user: user?._id,
          customer_details: {
            customer_name: values.name,
            customer_email: values.email,
            customer_phone: values.phone,
            customer_address: {
              city: values.city,
              street: values.street,
              building: values.building,
            },
          },
          payment_details: {
            terminal_number: payment.terminal_number,
            transaction_number: payment.transaction_number,
            last_digits: payment.last_digits,
          },
          products: cartItems.map((pr) => {
            return {
              product: pr._id,
              RTP: pr.product_price,
              quantity: pr.quantity,
            };
          }),
        }
      );

      setCartItems([]);
      alert(`Your order is placed, order number: ${order_status.order_number}`);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const { data: payment_status } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/payments/pay`,
        { credit_number: paymentsValues.credit }
      );

      setPayment(payment_status);
      continuePlaceOrder();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const test = () => {
    if (cartItems.length < 1) {
      navigate("/");
    }
  };

  useEffect(() => {
    test();
    window.scroll(0, 0);
  }, [cartItems]);

  return (
    <form onSubmit={placeOrder}>
      <Box minH="65vh" maxW="90%" mx="auto" py={10} px={4}>
        <Heading as="h2" size="xl" mb={4}>
          Order Items
        </Heading>
        <Box mb={4}>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th minW={170}>Quantity</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cartItems.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.product_name}</Td>
                  <Td>${item.product_price}</Td>
                  <Td>
                    <Text mx={1.5} as="b">
                      {item.quantity}
                    </Text>
                  </Td>
                  <Td>${(item.quantity * item.product_price).toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Heading as="h2" size="xl" mb={4}>
          Customer and Shipping Details
        </Heading>
        <Box mb={4}>
          <Flex direction="column" mb={4}>
            <Input
            value={values.name}
              isRequired
              onChange={handleChange}
              name="name"
              placeholder="Full Name"
              mb={2}
            />
            <Input
            value={values.email}
              isRequired
              onChange={handleChange}
              name="email"
              placeholder="Email"
              mb={2}
              type="email"
            />
            <Input
            value={values.phone}
              isRequired
              onChange={handleChange}
              name="phone"
              placeholder="Phone"
              mb={2}
            />
            <Input
            value={values.street}
              isRequired
              onChange={handleChange}
              name="street"
              placeholder="Address"
              mb={2}
            />
            <Input
            value={values.city}
              isRequired
              onChange={handleChange}
              name="city"
              placeholder="City"
              mb={2}
            />
            <Input
            value={values.building}
              isRequired
              onChange={handleChange}
              name="building"
              placeholder="Building"
              mb={2}
            />
          </Flex>
        </Box>
        <Heading as="h2" size="xl" mb={4}>
          Credit Card Details
        </Heading>
        <Box mb={4}>
          <Flex direction="column" mb={4}>
            <Input
              isRequired
              onChange={(e) =>
                setPaymentValues({ ...paymentsValues, credit: e.target.value })
              }
              name="cardNumber"
              placeholder="Card Number"
              mb={2}
            />
            <Input
              isRequired
              onChange={(e) =>
                setPaymentValues({ ...paymentsValues, exp: e.target.value })
              }
              name="expDate"
              placeholder="Expiration Date"
              mb={2}
            />
            <Input
              isRequired
              onChange={(e) =>
                setPaymentValues({ ...paymentsValues, cvv: e.target.value })
              }
              name="cvv"
              placeholder="CVV"
              mb={2}
            />
          </Flex>
        </Box>
        <Button type="submit" colorScheme="orange">
          Place Order
        </Button>
      </Box>
    </form>
  );
};

export default PurchasePage;
