// pages/index.tsx
'use client'; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { Comic } from '../types/types';  // Make sure to import your type
import { fetchMarvelData } from '../utils/marvelApi';  // Import your API fetch function
import Link from 'next/link';  // Import Link from Next.js
import useStore from './store';  // Import the zustand store

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');  // State for search term
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);  // State for filtered comics
  const [error, setError] = useState<string | null>(null);  // To handle error state

  // Get and set the favorites
  const { addFavorite, removeFavorite, favorites, setFavoritesFromLocalStorage } = useStore();

  // Fetch comics data when the component mounts
  useEffect(() => {
    fetchMarvelData<Comic>('comics', { orderBy: '-modified', limit: 30 })
      .then((data) => setComics(data.data.results))
      .catch((error) => {
        setError('Failed to fetch comics. Please try again later.');
        console.error(error.response?.data || error.message);  // Log the actual error details
      });

    // Set the favorites from localStorage
    setFavoritesFromLocalStorage();
  }, [setFavoritesFromLocalStorage]);

  // Filter comics based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredComics(comics);  // Show all comics if search term is empty
    } else {
      setFilteredComics(
        comics.filter((comic) =>
          comic.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, comics]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marvel Comics</h1>

      {/* Error message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Search field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on change
        placeholder="Search for comics"
        className="border p-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto rounded text-black"
      />

      <div className="mt-4 text-center">
        <Link href="/favorites" className="text-blue-500 hover:underline">
          Go to Favorites
        </Link>
      </div>
      
      {/* Comics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredComics.length > 0 ? (
          filteredComics.map((comic) => (
            <div key={comic.id} className="bg-white shadow rounded p-4">
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                className="w-full h-auto"
              />
              <h2 className="text-lg font-semibold mt-2 text-black">{comic.title}</h2>

              <button
                className={`mt-2 p-2 rounded ${favorites.some((fav) => fav.id === comic.id) ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() =>
                  favorites.some((fav) => fav.id === comic.id)
                    ? removeFavorite(comic)
                    : addFavorite(comic)
                }
              >
                {favorites.some((fav) => fav.id === comic.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">No comics found</div>
        )}
      </div>
    </div>
  );
}
