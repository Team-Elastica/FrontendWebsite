import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './App.css'
import Header from './Header';
import Result from './Result';
import Input from './Input';
import Cart from './Cart';
import Login from './Login'; 
import Signup from './signUp';
import {getPopularMedia, get_closest_keystroke_match, get_recommendations} from "./services/api"


function App() {
  /*cart of movies user chooses*/
  const [cart, setCart] = useState([]);
  /*state to track recommendations*/
  const [recommendations, setRecommendations] = useState({
    movies: [],
    shows: [],
    games: []
  });

  /*function to add to cart*/
  const addToCart = (media) => {
    //avoid duplicates
    if(!cart.some(item => item.id === media.id)) {
      const mediaCopy = {...media, hasAddButton: false};
      //important variables are media.id, media.title, media.type
      setCart([...cart, mediaCopy]);
    }
  };

  /*function to remove from cart*/
  const removeFromCart = (media) => {
    setCart(cart.filter((item) => item.id !== media.id));
  };

  /*function to handle recommendation*/
  const handleRecommend = async() => {
    // Your recommendation logic goes here
    // For now, just passing the cart items to the Result component
    setRecommendations(await get_recommendations(cart));
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="main-content">
            <Input addToCart={addToCart} removeFromCart={removeFromCart} />
            <Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
            <button
              className="recommend-button"
              onClick={handleRecommend}
              disabled={cart.length === 0}
            >
              Recommend
            </button>
            <Result recommendations={recommendations} addToCart={addToCart} removeFromCart={removeFromCart} />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
