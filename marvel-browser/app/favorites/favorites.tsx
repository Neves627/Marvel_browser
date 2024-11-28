'use client';

import { useEffect, useState } from 'react';
import { Comic } from '../../types/types'; // Adjust path based on your file structure
import Link from 'next/link'; // Import Link from Next.js

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Comic[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Comics</h1>

      {/* Display favorites */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((comic) => (
            <div key={comic.id} className="bg-white shadow rounded p-4">
              <Link href={`/comics/${comic.id}`}>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  className="w-full h-auto"
                />
                <h2 className="text-lg font-semibold mt-2 text-black">{comic.title}</h2>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You don't have any favorites yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
