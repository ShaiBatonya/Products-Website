import { Button, ButtonGroup, Flex, Box } from "@chakra-ui/react";
import { useState } from "react";
import { FaHamburger } from "react-icons/fa";
import { BiUserCircle, BiHomeCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import ShoppingCart from "./ShoppingCart";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { toast } from "react-toastify";

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const nav_styles = {
    display: [isOpen ? "flex" : "none", "flex"],
    gap: 5,
    p: 7,
  };

  const button_styles = {
    top: [2, 1],
    left: 5,
    display: ["inherit", "none"],
  };

  const changeOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async() =>{
      try {
        const response = await logout();
        toast.success(response.message);

        
      } catch (error) {
        toast.error(error.error);
      }
  };

  return (
    <div
      style={{
        backgroundColor: "orange",
      }}
    >
      <Button onClick={changeOpen} sx={button_styles}>
        <FaHamburger />
      </Button>
      <Flex
        justifyContent="space-between"
        direction={["column", "row"]}
        sx={nav_styles}
      >
        <ButtonGroup>
          <Button
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
            <Link to="/">
              <BiHomeCircle />
            </Link>
          </Button>
          <Button
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
            <Link to="/about">about</Link>
          </Button>
          <Button
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
            <Link to="/contact">contact</Link>
          </Button>
        </ButtonGroup>
        <div /* style={{ position: "relative" }} */>
          <Box
            as={Link}
            to="/"
            style={{
              clipPath: "circle(50% at 50% 50%)",
              backgroundImage: "url('/logo.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "65px",
              height: "65px",
              position: "absolute",
              top: "0.8%",
            }}
          ></Box>
        </div>
        <ButtonGroup>
          {user && (
            <Button
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
              <Link to="/profile">
                <BiUserCircle />
              </Link>
            </Button>
          )}
          {!user && (
            <Button
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
              <Link to="/register">register</Link>
            </Button>
          )}
          {!user && (
            <Button
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
              <Link to="/login">login</Link>
            </Button>
          )}
          {user && (
            <Button
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
              <Link to="/orders">orders</Link>
            </Button>
          )}
          {user && 
          <Button
          sx={{
            _hover: {
              cursor: "pointer",
              border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
            onClick={handleLogout}
            >
            logout
          </Button>
          }
            <ShoppingCart />
        </ButtonGroup>
      </Flex>
    </div>
  );
}

export default Nav;
