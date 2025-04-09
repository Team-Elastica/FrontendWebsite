import React from 'react';
import MediaCard from "./assets/components/MediaCard";
import "./index.css";

function Result({ recommendations, addToCart, removeFromCart, favorites, toggleFavorite }) {
    //get each media list
    const movies = recommendations?.movies?.slice(0, 5) || [];
    const shows = recommendations?.shows?.slice(0, 5) || [];
    const games = recommendations?.games?.slice(0, 5) || [];

    return (
        <section className="recommendation-section">
            <h2 className="title">Recommendations</h2>
    
            {/* Movies Section */}
            <div className="category">
                <h3>Movies</h3>
                <div className="media-row">
                    {movies.length > 0 ? (
                        movies.map(media => (
                            <MediaCard 
                                key={media.id} 
                                media={media} 
                                addToCart={addToCart} 
                                removeFromCart={removeFromCart} 
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                            />
                        ))
                    ) : (
                        <p>No movie recommendations available</p>
                    )}
                </div>
            </div>
    
            {/* Shows Section */}
            <div className="category">
                <h3>Shows</h3>
                <div className="media-row">
                    {shows.length > 0 ? (
                        shows.map(media => (
                            <MediaCard 
                            key={media.id} 
                            media={media} 
                            addToCart={addToCart} 
                            removeFromCart={removeFromCart} 
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                        />
                        ))
                    ) : (
                        <p>No show recommendations available</p>
                    )}
                </div>
            </div>
    
            {/* Games Section */}
            <div className="category">
                <h3>Games</h3>
                <div className="media-row">
                    {games.length > 0 ? (
                        games.map(media => (
                            <MediaCard 
                                key={media.id} 
                                media={media} 
                                addToCart={addToCart} 
                                removeFromCart={removeFromCart} 
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                        />
                        ))
                    ) : (
                        <p>No game recommendations available</p>
                    )}
                </div>
            </div>
      </section>
    );
  }
  
  export default Result;
