import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Collection } from './pages/Collection'
import { ProductDetail } from './pages/ProductDetail'
import { Testimonials } from './pages/Testimonials'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { store } from './store'
import './App.css'


export const backend_url = import.meta.env.VITE_BACKEND_URL

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") ?? "");


  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return (
    <main>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Provider store={store}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
            </Routes>
          </Provider>

        </>
      )}
    </main>
  )
}

export default App
