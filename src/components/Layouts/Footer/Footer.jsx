import { Box, Container, SimpleGrid, Stack, Text, Image, Link, VStack, Heading, HStack, Button, } from '@chakra-ui/react';
import logo from '@/assets/react.svg';

const Footer = () => {
    return (
        <>
            {/* Newsletter */}
            <Box
                py={16}
                bgColor={'brand.50'}
                textAlign="center"
            >
                <VStack spacing={4}>
                    <Heading size="lg">Đăng ký nhận thông tin</Heading>
                    <Text>Nhận thông tin về sản phẩm mới và khuyến mãi</Text>
                    <HStack>
                        <Button raised>Đăng ký ngay</Button>
                    </HStack>
                </VStack>
            </Box>
            <Container fluid={'true'} backgroundColor={'#fefbf4'} borderTopWidth={'1px'} borderColor={'#ede0cc'}>
                <Box>
                    <Container maxW="container.xl" py={10}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                            {/* Logo and About */}
                            <Stack spacing={6}>
                                <Box>
                                    <Image src={logo} w="120px" />
                                </Box>
                                <Text fontSize="sm">
                                    Chuyên cung cấp các sản phẩm chính hãng từ các thương hiệu uy tín
                                </Text>
                            </Stack>

                            {/* Products */}
                            <Stack align="flex-start">
                                <Text fontWeight="600" fontSize="lg" mb={2}>Sản phẩm</Text>
                                <Link>Chăm sóc da mặt</Link>
                                <Link>Chăm sóc cơ thể</Link>
                                <Link>Chăm sóc tóc</Link>
                                <Link>Trang điểm</Link>
                            </Stack>

                            {/* Support */}
                            <Stack align="flex-start">
                                <Text fontWeight="600" fontSize="lg" mb={2}>Hỗ trợ</Text>
                                <Link>Hướng dẫn mua hàng</Link>
                                <Link>Chính sách đổi trả</Link>
                                <Link>Chính sách bảo mật</Link>
                                <Link>Liên hệ</Link>
                            </Stack>

                            {/* Contact */}
                            <Stack align="flex-start">
                                <Text fontWeight="600" fontSize="lg" mb={2}>Liên hệ</Text>
                                <Text>Hotline: 1900 xxxx</Text>
                                <Text>Email: support@example.com</Text>
                                <Text>Địa chỉ: 123 ABC Street</Text>
                            </Stack>
                        </SimpleGrid>

                        <Box borderTopWidth={1} borderColor="#ede0cc" pt={8} mt={8}>
                            <Text textAlign="center" fontSize="sm">
                                © {new Date().getFullYear()} Your Company. All rights reserved.
                            </Text>
                        </Box>
                    </Container>
                </Box>
            </Container>
        </>
    );
};

export default Footer;