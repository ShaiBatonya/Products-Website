import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useOutsideClick,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Flex,
  HStack,
  Badge,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const [totalProducts, setTotalProducts] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addToCart = (item) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem._id === item._id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });

    setCartItems(updatedCartItems);
  };

  const removeFromCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem.quantity === 1) {
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem._id !== item._id)
      );
    } else {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });

      setCartItems(updatedCartItems);
    }
  };

  const deleteFromCart = (item) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem._id !== item._id)
    );
  };

  const resetCart = () => {
    setCartItems([]);
  };

  useEffect(() => {

    setTotalProducts(cartItems.length);

    const total_price = cartItems.reduce(
      (total, item) => total + item.quantity * item.product_price,
      0
    );

    setTotalPrice(total_price.toFixed(2));
  }, [cartItems]);

  return (
    <>
      <Button
        onClick={onOpen}
        sx={{
          _hover: {
            cursor: "pointer",
            border: "2px",
            borderColor: "white",
          },
          border: "none",
        }}
        variant="outline"
      >
        {totalProducts && totalProducts !== 0 ? (
          <Badge fontSize="md" colorScheme="purple">
            {totalProducts}
          </Badge>
        ) : null}

        <FaShoppingCart />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxW="800px" // Adjust the desired width here
          mx="auto" // Center the modal horizontally
        >
          <ModalHeader>Cart</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {cartItems.length === 0 ? (
              <p>Your Cart is Empty</p>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Image</Th>
                    <Th>Product</Th>
                    <Th>Price</Th>
                    <Th minW={170}>Quantity</Th>
                    <Th>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cartItems.map((item) => (
                    <Tr key={item._id}>
                      <Td>
                        <Button
                          onClick={() => {
                            deleteFromCart(item);
                          }}
                        >
                          X
                        </Button>
                      </Td>
                      <Td>
                        <Image maxW="100%" src={item.product_image}></Image>
                      </Td>
                      <Td>{item.product_name}</Td>
                      <Td>${item.product_price}</Td>
                      <Td>
                        <Button
                          mx={1}
                          colorScheme="red"
                          onClick={() => removeFromCart(item)}
                        >
                          -
                        </Button>
                        <Text mx={1.5} as="b">
                          {item.quantity}
                        </Text>
                        <Button
                          colorScheme="green"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </Button>
                      </Td>
                      <Td>
                        ${(item.quantity * item.product_price).toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
            {cartItems.length !== 0 && (
              <Text mt={5} textAlign="center" fontWeight={700}>
                Cart Total Price : {totalPrice}$
              </Text>
            )}
          </ModalBody>
          <Flex p={3} justifyContent="space-between">
            {cartItems.length !== 0 && (
              <>
                <Button
                  onClick={onClose}
                  as={Link}
                  to="/purchase"
                  colorScheme="yellow"
                >
                  Buy Now
                </Button>
                <Button colorScheme="orange" /* mr={3} */ onClick={resetCart}>
                  Delete Cart
                  <AiFillDelete style={{ marginLeft: 2 }} />
                </Button>
              </>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShoppingCart;
