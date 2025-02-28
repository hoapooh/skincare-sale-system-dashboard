import Navbar from './Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer/Footer'
import { Box, Flex } from '@chakra-ui/react'

const MainLayout = () => {
    return (
        <Flex direction={'column'} flex={'1'} minHeight={'100vh'}>
            <Navbar />
            <Box flex={'1'}>
                <Outlet />
            </Box>
            <Box marginTop={'auto'} >
                <Footer />
            </Box>
        </Flex>
    )
}

export default MainLayout