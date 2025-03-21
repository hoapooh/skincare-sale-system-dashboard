import { Box, Flex, Icon } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon, children, path, onClose, ...rest }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  const color = isActive ? 'white' : 'black';

  return (
    <Link to={path} onClick={onClose}>
      <Box style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'black',
            color: 'white',
          }}
          color={color}
          bg={isActive ? 'black' : 'transparent'}
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
