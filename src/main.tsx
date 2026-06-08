import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {createTheme, ThemeProvider } from '@mui/material'
import { AuthProvider } from './context/AuthContext.tsx'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'

axios.defaults.baseURL ="https://chatbot-gxi9.onrender.com/api/v1";
axios.defaults.withCredentials = true;//allows the exchange of cookies😐
const theme = createTheme(
  {typography: {
    fontFamily:"Roboto Slab,serif", 
    allVariants:{color:"white"}
  }}
)
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position='top-right'/>
          <App />
        </ThemeProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
