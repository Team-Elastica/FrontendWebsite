import { useState } from 'react'
import './App.css'
import Header from './Header';
import Result from './Result';
// import Card from './assets/components/MediaCard';

function App() {
  return (
    <div>
      <section>
        <Header />
      </section>
      <section>
        <Result />
      </section>
    </div>
    
  );
}

export default App;
