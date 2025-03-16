import { Box, Flex, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NavItem = ({ icon, children, path, ...rest }) => {
    return (
        <Link to={path}>
            <Box
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
            >
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    _hover={{
                        bg: 'brown',
                        color: 'white',
                    }}
                    {...rest}
                >
                    {icon && (
                        <Icon
                            mr="4"
                            size={'lg'}
                            _groupHover={{
                                color: 'white',
                            }}
                        >
                            {icon}
                        </Icon>
                    )}
                    {children}
                </Flex>
            </Box>
        </Link>
    );
};

export default NavItem;
