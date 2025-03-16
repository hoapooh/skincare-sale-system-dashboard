import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxW="container.xl" h="100vh" backgroundColor={'#fefbf4'} fluid={'true'}>
            <VStack
                spacing={8}
                justify="center"
                align="center"
                h="full"
                textAlign="center"
            >
                <Heading
                    fontSize={{ base: '6xl', md: '8xl' }}
                    fontWeight="bold"
                    color="brand.500"
                >
                    404
                </Heading>
                <Box>
                    <Heading mb={4}>Trang không tồn tại</Heading>
                    <Text fontSize="lg" color="gray.600" mb={8}>
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </Text>
                </Box>
                <Button
                    colorScheme="brand"
                    size="lg"
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </Button>
            </VStack>
        </Container>
    );
};

export default NotFound;