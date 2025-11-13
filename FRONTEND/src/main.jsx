import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routing/routeTree.js'
import store from './store/store.js'
import { Provider } from 'react-redux'

const router = createRouter({routeTree})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
