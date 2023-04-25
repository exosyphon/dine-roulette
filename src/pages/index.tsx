import { useEffect, useState, useMemo } from 'react';

export default function Home() {
  const foods = ['Mexican', 'Italian', 'Greek', 'American', 'Thai', 'French', 'Chinese', 'Indian'];
  const styles = ['Tacos', 'Burgers', 'Pizza', 'Steak', 'Seafood', 'Fries', 'BBQ', 'Casserole', 'Pasta'];

  const [food, setFood] = useState('');
  const [style, setStyle] = useState('');

  const roll = () => {
    setFood(foods[Math.floor(Math.random() * foods.length)]);
    setStyle(styles[Math.floor(Math.random() * style.length)]);
  };

  useEffect(() => {
    setFood(foods[Math.floor(Math.random() * foods.length)]);
    setStyle(styles[Math.floor(Math.random() * styles.length)]);
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            style={{ background: 'blue', height: '50px', width: '150px', color: 'white', marginBottom: '3rem' }}
            onClick={roll}
          >
            Roll!
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="die">
            <div className="face">{food}</div>
          </div>
          <div className="die">
            <div className="face">{style}</div>
          </div>
        </div>
      </div>
    </>
  );
}
