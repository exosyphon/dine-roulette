import { useState } from 'react';

export default function Home() {
  const foods: string[] = ['Mexican', 'Italian', 'Greek', 'American', 'Thai', 'French']; //, 'Chinese', 'Indian'];
  const styles: string[] = ['Tacos', 'Burgers', 'Pizza', 'Steak', 'Seafood', 'Fries', 'BBQ', 'Casserole', 'Pasta'];
  const sides: string[] = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const customTextCss: string[] = ['', 'invert-text', '', '', '', 'rotated-text'];

  const [rolling, setRolling] = useState<boolean>(false);
  const [food, setFood] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [diceOneSide, setDiceOneSide] = useState<number>(0);
  const [diceTwoSide, setDiceTwoSide] = useState<number>(0);

  const roll = () => {
    setRolling(true);

    const diceOneSide = Math.floor(Math.random() * foods.length);
    const diceTwoSide = Math.floor(Math.random() * foods.length);
    setDiceOneSide(diceOneSide);
    setDiceTwoSide(diceTwoSide);
    setFood(foods[diceOneSide]);
    setStyle(styles[diceTwoSide]);

    setTimeout(() => setRolling(false), 1000);
  };

  function randomizeValue(max: number, min: number = 0): number {
      const value = Math.floor(Math.random() * max);
      return value < min ? randomizeValue(max, min) : value;
  };

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
        <div
          className={'mb-8'}
          style={{
            fontSize: '44px',
            fontWeight: 'bold',
          }}
        >
          Dine Roulette!
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            style={{ background: 'blue', height: '50px', width: '150px', color: 'white', marginBottom: '3rem' }}
            onClick={roll}
          >
            Roll!
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={`dice ${rolling ? 'rolling' : ''} rolled-${sides[diceOneSide]}`}>
            {foods?.map((item, index) => {
              const h = randomizeValue(360);
              const s = randomizeValue(95, 5);
              const l = randomizeValue(80, 40);
              return (
                <div key={index} className={`side ${sides[index]}`}
                     style={{backgroundColor: `hsl(${h} ${s}% ${l}%)`, outline: `1px solid hsl(${h} ${s}% ${l - 10}%)`}}>
                  <div className={customTextCss[index]}>{item}</div>
                </div>
              );
            })}
          </div>
          <div className={`ml-5 dice ${rolling ? 'rolling' : ''} rolled-${sides[diceTwoSide]}`}>
            {styles?.map((item, index) => {
              const h = randomizeValue(360)
              const s = randomizeValue(95, 5)
              const l = randomizeValue(80, 40)
              return (
                <div key={index} className={`side ${sides[index]}`} style={{backgroundColor: `hsl(${h} ${s}% ${l}%)`, outline: `1px solid hsl(${h} ${s}% ${l - 10}%)`}}>

                  <div className={customTextCss[index]}>{item}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
