import { Box, Container, Flex, HStack, Image, Link, LinkBox } from '@chakra-ui/react'
import logo from '@/assets/react.svg'

const Navbar = () => {
    return (
        <Container fluid={'true'} backgroundColor={'#fefbf4'} borderBottomWidth={'1px'} borderColor={'#ede0cc'}>
            <HStack justifyContent={'space-between'}>
                <Flex alignItems='center' gap='10' flex='1' justifyContent={'flex-start'}>
                    <Link>
                        Sản phẩm
                    </Link>
                    <Link>
                        Khuyến mãi
                    </Link>
                    <Link>
                        Cocoon
                    </Link>
                    <Link>
                        Bài viết
                    </Link>
                </Flex>
                <LinkBox>
                    <Image
                        src={logo}
                        boxSize={{
                            base: '50px',
                            lg: '80px',
                        }}
                        objectFit='cover'
                    ></Image>
                </LinkBox>
                <Flex alignItems='center' gap='10' flex='1' justifyContent={'flex-end'}>
                    <Link>
                        Đăng nhập
                    </Link>
                    <Link>
                        Giỏ hàng
                    </Link>
                </Flex>
            </HStack>
        </Container>
    )
}

export default Navbar