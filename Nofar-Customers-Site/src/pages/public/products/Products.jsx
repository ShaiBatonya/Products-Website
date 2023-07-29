import { useContext, useEffect, useState } from "react";
import ProductCard from "../../../components/partials/products/ProductCard";
import axios from "axios";
import { BsSearchHeart } from "react-icons/bs";
import { useLoaderData, useLocation } from "react-router-dom";
import {
  Box,
  ButtonGroup,
  Heading,
  Text,
  Container,
  Flex,
  HStack,
  Button,
  Input,
  InputRightElement,
  InputGroup,
  Divider,
} from "@chakra-ui/react";
import { CartContext } from "../../../context/CartContext";
import Pagination from "./Pagination";
import { Helmet } from "react-helmet";

const abortController = new AbortController();

function Products() {
  const productsInit = useLoaderData();
  const [filterStatus, setFilterStatus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([...productsInit]);
  const [filteredProducts, setFilteredProducts] = useState([...productsInit]);

  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, setCartItems } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });

      setCartItems(updatedCartItems);
    } else {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  const onChangeHandle = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const searchResults = productsInit.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(searchResults);
  }, [searchTerm, productsInit]);

  useEffect(() => {
    const productId = location.hash.substring(1);
    if (productId) {
      const targetSection = document.getElementById(productId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        targetSection.className = "shadow";
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/categories/customers/all`,
          { signal: abortController.signal }
        );
        setCategories(data.categories);
      } catch (error) {
        console.log(error.response.data.error);
      }
    };

    getAllCategories();

    return () => {
      abortController.abort();
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterByCategory = (categoryId) => {
    setFilterStatus(categoryId);

    if (categoryId === null) {
      setFilteredProducts([...productsInit]);
    } else {
      const filteredByCategory = productsInit.filter((product) =>
        product.categories.some((category) => category.category === categoryId)
      );
      setFilteredProducts(filteredByCategory);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Products</title>
        <meta name="description" content="home page" />
      </Helmet>
      <Box minH="65vh" maxW="90%" mx="auto" py={10} px={4}>
        <Heading as="h2" size="xl" mb={6}>
          Home
        </Heading>
        <Text my={5}>
          Welcome to our Designer Headscarves for Women Website! Express your
          unique style and embrace the beauty of headscarves with our exquisite
          collection of designer headscarves for women. We are passionate about
          empowering women to celebrate their individuality and embrace their
          cultural heritage through fashionable accessories. Discover a world of
          elegance, sophistication, and versatility as you explore our carefully
          curated selection of headscarves. From vibrant patterns to delicate
          textures, our collection showcases the artistry and craftsmanship of
          talented designers from around the globe.
        </Text>
{/*         <Box
          as="video"
          src="/homepage_video.mp4"
          alt="home page video"
          objectFit="cover"
          width="100%"
          sx={{
            aspectRatio: "16/9",
            maxH: "250px",
          }}
          autoPlay
          muted
          loop
        ></Box> */}
        <Text my={5}>
          At Nofar, we believe that fashion has no boundaries.
          Whether you wear a headscarf for cultural, religious, or personal
          reasons, we celebrate your choice and aim to provide you with
          headscarves that empower you to express your individuality with
          confidence.
        </Text>
        <Text my={5}>
          Thank you for visiting our Designer Headscarves for Women Website.
          Start exploring our collection today and find the perfect headscarf
          that will become an integral part of your signature style.
        </Text>
        <Heading my={5}>Our Products</Heading>
        <Divider />
        <HStack mt={5} justifyContent={"space-between"}>
          <ButtonGroup my={5}>
            <Text alignSelf={"center"}>Filter By Category : </Text>
            <Button
              variant={filterStatus === null ? "solid" : "outline"}
              onClick={() => handleFilterByCategory(null)}
              colorScheme="orange"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={filterStatus === category._id ? "solid" : "outline"}
                onClick={() => handleFilterByCategory(category._id)}
                colorScheme="blue"
              >
                {category.category_name}
              </Button>
            ))}
          </ButtonGroup>
          <InputGroup maxW={480}>
            <Input
              placeholder="Search by product name or description"
              value={searchTerm}
              onChange={onChangeHandle}
            />
            <InputRightElement>
              <BsSearchHeart />
            </InputRightElement>
          </InputGroup>
        </HStack>
        <Flex
          direction={["column", "column", "row", "row"]}
          flexWrap="wrap"
          my={5}
          justifyContent="center"
          gap="4"
        >
          {loading && <span>Loading...</span>}
          {error && <span>{error}</span>}
          {currentProducts.map((product) => (
            <ProductCard
              key={product._id}
              addToCart={addToCart}
              product={product}
            />
          ))}
        </Flex>
        <Pagination
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          onPageChange={handlePageChange}
        />
      </Box>
    </>
  );
}

export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/products/customers/all`
    );
    return data.products;
  } catch (error) {
    return error.response.data.error;
  }
};

export default Products;
