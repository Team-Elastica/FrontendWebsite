import { useState , useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { database } from './firebase';
import { ref, set, remove, get } from "firebase/database";

import './App.css'
import Header from './Header';
import Result from './Result';
import Input from './Input';
import Cart from './Cart';
import Login from './Login'; 
import Signup from './signUp';
import Hero from './Hero';
import FavoritesPage from './favorites';

import {getPopularMedia, get_closest_keystroke_match, get_recommendations} from "./services/api"


function App() {
  /*cart of movies user chooses*/
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

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

  const toggleFavorite = async (media) => {
    console.log("Toggling favorite:", media);

    if (!user?.uid) return alert("Please log in to manage favorites.");
  
    const favRef = ref(database, `users/${user.uid}/favorites/${media.id}`);
  
    const snapshot = await get(favRef);
  
    if (snapshot.exists()) {
      // Remove from favorites
      await remove(favRef);
      setFavorites(prev => prev.filter(item => item.id !== media.id));
    } else {
      // Add to favorites
      await set(favRef, media);
      setFavorites(prev => [...prev, media]);
    }
  };
  

  useEffect(() => {
    if (user?.uid) {
      const userFavsRef = ref(database, `users/${user.uid}/favorites`);
      get(userFavsRef).then(snapshot => {
        if (snapshot.exists()) {
          const favData = Object.values(snapshot.val());
          setFavorites(favData);
        } else {
          setFavorites([]);
        }
      });
    }
  }, [user]);


  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={
          
      <div className="main-content">
            <Hero />
            <Input 
              addToCart={addToCart} 
              removeFromCart={removeFromCart} 
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              />    
              <Cart 
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            <button
              className="recommend-button"
              onClick={handleRecommend}
              disabled={cart.length === 0}
            >
              Recommend
            </button>
            <Result 
              recommendations={recommendations}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </div>
        } />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} removeFromCart={removeFromCart}
        />
      } />
      </Routes>
    </Router>
  );
}

export default App;
