import React from 'react';
import MediaCard from "./assets/components/MediaCard";
import "./assets/css/favorites.css";



function FavoritesPage({ favorites, toggleFavorite, addToCart, removeFromCart }) {
    const movies = favorites?.movies?.slice(0, 5) || [];
    const shows = favorites?.shows?.slice(0, 5) || [];
    const games = favorites?.games?.slice(0, 5) || [];


  return (
    <div className="favorites-page" style={{ padding: '40px', paddingTop: '120px' }}>
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;