import '@fontsource/roboto/300.css'; // Light
import '@fontsource/roboto/400.css'; // Regular
import '@fontsource/roboto/700.css'; // Bold
import '@fontsource/roboto/900.css'; // Black
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './configs/theme';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/toaster.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
