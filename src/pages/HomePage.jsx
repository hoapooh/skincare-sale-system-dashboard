import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Image,
    Text,
    Button,
    VStack,
    HStack
} from '@chakra-ui/react';

const HomePage = () => {
    return (
        <Container maxW="container.xl" p={0} backgroundColor={'#fefbf4'} fluid={'true'}>
            {/* Hero Section */}
            <Box
                h="500px"
                bg="brand.50"
                mb={10}
                position="relative"
            >
                <VStack
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    spacing={4}
                    textAlign="center"
                >
                    <Heading size="2xl">Chăm Sóc Da Toàn Diện</Heading>
                    <Text fontSize="xl">Khám phá bộ sưu tập sản phẩm chăm sóc da cao cấp</Text>
                    <Button colorScheme="brand" size="lg">Mua Ngay</Button>
                </VStack>
            </Box>

            {/* Featured Categories */}
            <Box py={10}>
                <Heading textAlign="center" mb={8}>Danh Mục Nổi Bật</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                    {['Chăm sóc da mặt', 'Chăm sóc cơ thể', 'Trang điểm'].map((category) => (
                        <VStack
                            key={category}
                            p={6}
                            bg="white"
                            borderRadius="lg"
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
                        >
                            <Box h="200px" w="full" bg="gray.200" borderRadius="md" mb={4}></Box>
                            <Heading size="md">{category}</Heading>
                            <Button variant="outline" colorScheme="brand">Xem thêm</Button>
                        </VStack>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Best Sellers */}
            <Box py={10}>
                <Heading textAlign="center" mb={8}>Sản Phẩm Bán Chạy</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                    {Array(4).fill('').map((_, i) => (
                        <VStack
                            key={i}
                            p={4}
                            bg="white"
                            borderRadius="lg"
                            boxShadow="sm"
                        >
                            <Box h="200px" w="full" bg="gray.200" borderRadius="md"></Box>
                            <Text fontWeight="bold">Sản phẩm {i + 1}</Text>
                            <Text color="brand.500" fontWeight="bold">500.000đ</Text>
                            <Button w="full" colorScheme="brand">Thêm vào giỏ</Button>
                        </VStack>
                    ))}
                </SimpleGrid>
            </Box>


        </Container>
    );
};

export default HomePage;