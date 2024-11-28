'use client'; 

import { useEffect, useState } from 'react';
import { Comic } from '../types/types';
import useStore from './store'; // Import the Zustand store

export default function Favorites() {
  const { favorites, setFavoritesFromLocalStorage } = useStore();
  const [filteredFavorites, setFilteredFavorites] = useState<Comic[]>(favorites);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    setFavoritesFromLocalStorage();
  }, [setFavoritesFromLocalStorage]);

  useEffect(() => {
    setFilteredFavorites(favorites); // Update the filtered favorites list
  }, [favorites]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Comics</h1>

      {/* Display message if no favorites */}
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500">You have no favorite comics.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFavorites.map((comic) => (
            <div key={comic.id} className="bg-white shadow rounded p-4">
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                className="w-full h-auto"
              />
              <h2 className="text-lg font-semibold mt-2 text-black">{comic.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

