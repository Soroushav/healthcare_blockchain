import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThirdwebProvider } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider
      chains={[sepolia]}      // you can add more chains here
      clientId="849f73bc2fdbd0d8ae071c64cb55287a"  // or hardcode for testing
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>,
)
