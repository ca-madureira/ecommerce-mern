import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { store } from './store'
import { Home } from './pages/Home'

import { ProductDetail } from './pages/ProductDetail'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Cart } from './pages/Cart'
import OrdersPage from './pages/Orders'
import { MainLayout } from './components/MainLayout'
import { AuthLayout } from './components/AuthLayout'
import './App.css'
import CheckoutPage from './pages/Checkout'

export const backend_url = import.meta.env.VITE_BACKEND_URL

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") ?? "")

  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return (
    <main>
      <ToastContainer />
      <Provider store={store}>
        <Routes>
          {/* Layout com Header */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Layout sem Header */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Provider>
    </main>
  )
}

export default App
