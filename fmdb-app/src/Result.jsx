import React from 'react';

function Result() {
    return (
        <section className="recommendation-section">
            <h2 className="title">Recommendations</h2>
    
            {/* Movies Section */}
            <div className="category">
                <h3>Movies</h3>
                <div className="icon-row">
                    <p className="icon">🎬</p>
                    <p className="icon">🎬</p>
                    <p className="icon">🎬</p>
                    <p className="icon">🎬</p>
                    <p className="icon">🎬</p>

                </div>
            </div>
    
            {/* Shows Section */}
            <div className="category">
                <h3>Shows</h3>
                <div className="icon-row">
                    <p className="icon">📺</p>
                    <p className="icon">📺</p>
                    <p className="icon">📺</p>
                    <p className="icon">📺</p>
                    <p className="icon">📺</p>
                </div>
            </div>
    
            {/* Games Section */}
            <div className="category">
                <h3>Games</h3>
                <div className="icon-row">
                    <p className="icon">🎮</p>
                    <p className="icon">🎮</p>
                    <p className="icon">🎮</p>
                    <p className="icon">🎮</p>
                    <p className="icon">🎮</p>
                </div>
            </div>
      </section>
    );
  }
  
  export default Result;
