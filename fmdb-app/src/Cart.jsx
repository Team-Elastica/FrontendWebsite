import MediaCard from "./assets/components/MediaCard";
import {useState, useEffect} from 'react';
import "./assets/css/Cart.css";

function Cart({cart, addToCart, removeFromCart}) {
  return (
    <main className = "cart">   
      <div className="cart-title">Cart</div>
      <div className="cart-grid">
                {cart.map(
                    (media) => 
                        <MediaCard key={media.id} media={media} addToCart={addToCart} removeFromCart={removeFromCart}/>
                )}
        </div>
    </main>
  );
}

export default Cart;