import { useEffect, useState, useMemo } from 'react';
import { InfoWindowF, GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

export default function Home() {
  const foods: string[] = ['Mexican', 'Italian', 'Greek', 'American', 'Thai', 'French']; //, 'Chinese', 'Indian'];
  const styles: string[] = ['Tacos', 'Burgers', 'Pizza', 'Steak', 'Seafood', 'Fries', 'BBQ', 'Casserole', 'Pasta'];
  const sides: string[] = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const customTextCss: string[] = ['', 'invert-text', '', '', '', 'rotated-text'];
  const markerColors: Map<number, string> = new Map([
    [0, 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'],
    [1, 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'],
    [2, 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'],
    [3, 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'],
    [4, 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'],
  ]);

  const [foodS, setFoodS] = useState<number>(0);
  const [foodH, setFoodH] = useState<number>(0);
  const [foodL, setFoodL] = useState<number>(0);
  const [stylesS, setStylesS] = useState<number>(0);
  const [stylesH, setStylesH] = useState<number>(0);
  const [stylesL, setStylesL] = useState<number>(0);
  const [infoWindow, setInfoWindow] = useState<string>('');
  const [userLocation, setUserLocation] = useState<number>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rolling, setRolling] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [diceOneSide, setDiceOneSide] = useState<number>(0);
  const [diceTwoSide, setDiceTwoSide] = useState<number>(0);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const center = useMemo(() => ({ lat: 32.83339, lng: -96.79391 }), []);

  const getGeocode = async function (restaurant: Restaurant): Promise<Restaurant> {
    const address = restaurant.address.replace(' ', '+');
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        const location = data.results[0].geometry.location;
        restaurant.latitude = location.lat;
        restaurant.longitude = location.lng;
        return restaurant;
      });
  };

  const handleMarkerClick = async (address: string) => {
    setIsOpen(true);
    setInfoWindow(address);
  };

  type Restaurant = {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };

  type RestaurantData = {
    restaurants: Restaurant[];
  };

  const fetchFoodResults = async (food: string, style: string): Promise<void> => {
    return fetch('/api/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ food, style, userLocation }),
    })
      .then((res) => res.json())
      .then(async (data: RestaurantData) => {
        const restaurantData = await Promise.all(data.restaurants.map(async (restaurant) => getGeocode(restaurant)));
        setRestaurants(restaurantData);
      });
  };

  const getFoodNearMe = async () => {
    const diceOneSide = Math.floor(Math.random() * foods.length);
    const diceTwoSide = Math.floor(Math.random() * foods.length);
    setDiceOneSide(diceOneSide);
    setDiceTwoSide(diceTwoSide);

    await fetchFoodResults(foods[diceOneSide], styles[diceTwoSide]);
    setRolling(false);
  };

  const roll = async () => {
    setRolling(true);
    setTimeout(async () => await getFoodNearMe(), 1000);
  };

  function randomizeValue(max: number, min: number = 0): number {
    const value = Math.floor(Math.random() * max);
    return value < min ? randomizeValue(max, min) : value;
  }

  const getReverseGeocode = async (lat: number, lng: number) => {
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUserLocation(data.results[0].address_components.slice(-1)[0].short_name);
      });
  };

  useEffect(() => {
    setFoodH(randomizeValue(360));
    setFoodS(randomizeValue(95, 5));
    setFoodL(randomizeValue(80, 40));
    setStylesH(randomizeValue(360));
    setStylesS(randomizeValue(95, 5));
    setStylesL(randomizeValue(80, 40));
    navigator.geolocation.getCurrentPosition(function (position) {
      getReverseGeocode(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            width: '50%',
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
          {!userLocation && <div>Please allow User Location!</div>}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button
              style={{
                background: !!userLocation ? 'blue' : 'grey',
                height: '50px',
                width: '150px',
                color: 'white',
                marginBottom: '3rem',
              }}
              onClick={roll}
              disabled={!!userLocation ? '' : 'disabled'}
            >
              Roll!
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className={`dice ${rolling ? 'rolling' : ''} rolled-${sides[diceOneSide]}`}>
              {foods?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`side ${sides[index]}`}
                    style={{
                      backgroundColor: `hsl(${foodH} ${foodS}% ${foodL}%)`,
                      outline: `1px solid hsl(${foodH} ${foodS}% ${foodL - 10}%)`,
                    }}
                  >
                    <div className={customTextCss[index]}>{item}</div>
                  </div>
                );
              })}
            </div>
            <div className={`ml-5 dice ${rolling ? 'rolling' : ''} rolled-${sides[diceTwoSide]}`}>
              {styles?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`side ${sides[index]}`}
                    style={{
                      backgroundColor: `hsl(${stylesH} ${stylesS}% ${stylesL}%)`,
                      outline: `1px solid hsl(${stylesH} ${stylesS}% ${stylesL - 10}%)`,
                    }}
                  >
                    <div className={customTextCss[index]}>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            border: 'red solid 1px',
            height: '100vh',
            width: '50%',
          }}
        >
          {!isLoaded ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <GoogleMap mapContainerClassName="map-container" center={center} zoom={10}>
                {restaurants.length > 0 &&
                  restaurants.map((restaurant: Restaurant, index: number) => (
                    <MarkerF
                      key={index}
                      position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                      onClick={() => {
                        handleMarkerClick(restaurant.address);
                      }}
                      icon={{
                        url: markerColors.get(index) ?? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      }}
                    >
                      {isOpen && restaurant.address === infoWindow && (
                        <InfoWindowF
                          onCloseClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{restaurant.name}</div>
                            <div style={{ marginTop: '1rem' }}>{infoWindow}</div>
                          </div>
                        </InfoWindowF>
                      )}
                    </MarkerF>
                  ))}
              </GoogleMap>
            </>
          )}
        </div>
      </div>
    </>
  );
}
