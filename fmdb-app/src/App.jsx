import { useState } from 'react'
import './App.css'
import Header from './Header';
import Result from './Result';
import Input from './Input';
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
    <div className = "app-container">
      <Header />
      <div className = "main-content">
        <Input addToCart={addToCart} removeFromCart={removeFromCart}/>
        <Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}/>
        <Result />
      </div>
    </div>
  );
}

export default App;
