import { useState } from 'react'
import './App.css'
import Header from './Header';
import Result from './Result';
// import Card from './assets/components/MediaCard';

import Input from './Input';
import MediaCard from './assets/components/MediaCard';
import Cart from './Cart';
function App() {
  /*cart of movies user chooses*/
  const [cart, setCart] = useState([]);

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

  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
