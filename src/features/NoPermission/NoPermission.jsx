import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NoPermission = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" h="100vh" backgroundColor={'#fefbf4'}>
      <VStack
        spacing={8}
        justify="center"
        align="center"
        h="full"
        textAlign="center"
      >
        <Icon as={FiLock} w={20} h={20} color="red.500" />
        <Box>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} mb={4} color="red.500">
            Không có quyền truy cập
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8} maxW="md">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên hoặc quay lại trang chủ.
          </Text>
        </Box>
        <Button colorScheme="brand" size="lg" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      </VStack>
    </Container>
  );
};

export default NoPermission;
