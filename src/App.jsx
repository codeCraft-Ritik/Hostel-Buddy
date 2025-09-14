import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StickyNavbar from './components/common/Navbar'
import FooterWithLogo from './components/common/Footer'
import Products from './pages/Products'
import ProductForm from './pages/productDesForm'
import SignUpForm from './pages/signUpForm'
import Accounts from './pages/Accounts'
import ProductDetails from './components/ProductDetails';
import RaiseRequestForm from './pages/RaiseRequestForm';
import AllRequests from './pages/AllRequests'; 

function App() {
	return (
		<>
			<StickyNavbar />
			<div>
				<Routes>
					<Route path="/" element={<Products />} />
					<Route path="/product-form" element={<ProductForm />} />
					<Route path="/signup-form" element={<SignUpForm />} />
					<Route path="/accounts" element={<Accounts />} />
					<Route path='/lend' element={<ProductForm />} />
					<Route path='/product/:id' element={<ProductDetails />}/>
					<Route path='/product/edit/:id' element={<ProductForm />} />
					<Route path='/raise-request' element={<RaiseRequestForm />} />
					<Route path='/requests' element={<AllRequests />} />
				</Routes>
			</div>
			<FooterWithLogo />
		</>
	)
}

export default App