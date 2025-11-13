import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routing/routeTree.js'

const router = createRouter({routeTree})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </StrictMode>,
)
