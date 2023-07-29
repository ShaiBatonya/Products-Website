import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from './../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await logout();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.error);
    }
  };

  return (
    <Box as="footer" py={8} bg="gray.900" color="white">
      <Flex direction={{ base: 'column', md: 'row' }} maxW="7xl" mx="auto">
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-start' }}>
          <Text fontSize="lg" fontWeight="bold">
            Nofar
          </Text>
          <Text>&copy; {new Date().getFullYear()} All rights reserved.</Text>
        </VStack>
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-end' }}>
          <Link to="/">Home</Link>
          <Link to="about">About</Link>
          <Link to="contact">Contact</Link>
        </VStack>
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-end' }}>
          {!user && <Link to="register">Register</Link>}
          {!user && <Link to="login">Login</Link>}
          {user && <Link to="orders">Orders</Link>}
          {user && (
            <>
              <Link to="profile">Profile</Link>
              <Link onClick={handleLogout}>Logout</Link>
            </>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
