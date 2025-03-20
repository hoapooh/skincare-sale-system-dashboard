import { RiDashboardFill } from 'react-icons/ri';
import { FaUser, FaHistory, FaBlog } from 'react-icons/fa';
import { BsBoxSeamFill } from 'react-icons/bs';

export const LinkItems = [
  { name: 'Dashboard', icon: <RiDashboardFill />, link: '/' },
  { name: 'Users', icon: <FaUser />, link: '/users' },
  { name: 'Products', icon: <BsBoxSeamFill />, link: '/products' },
  { name: 'Orders', icon: <FaHistory />, link: '/orders' },
  { name: 'Blogs', icon: <FaBlog />, link: '/blogs' },
];
