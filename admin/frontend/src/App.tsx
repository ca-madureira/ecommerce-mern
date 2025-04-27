import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddCategory } from './pages/categories/AddCategory';
import { Layout } from './components/Layout';
import './App.css'
import { ListCategory } from './pages/categories/ListCategory';
import { AddProduct } from './pages/products/AddProduct';
import { ListProduct } from './pages/products/ListProduct';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="categories/create" element={<AddCategory />} />
          <Route path='categories' element={<ListCategory />} />
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/" element={<ListProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
