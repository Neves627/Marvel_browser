'use client'; // Ensure the component is a Client Component

import { useEffect, useState } from 'react';
import { Comic } from '../types/types';
import { fetchMarvelData } from '../utils/marvelApi';
import useStore from './store'; // Import the zustand store

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]); // Store for all comics
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]); // Filtered comics state
  const [error, setError] = useState<string | null>(null); // Error state
  const [showFavorites, setShowFavorites] = useState(false); // State to toggle favorites visibility

  // Get and set the favorites from zustand store
  const { addFavorite, removeFavorite, favorites, setFavoritesFromLocalStorage } = useStore();

  // Fetch comics data when the component mounts
  useEffect(() => {
    fetchMarvelData<Comic>('comics', { orderBy: '-modified', limit: 30 })
      .then((data) => setComics(data.data.results))
      .catch((error) => {
        setError('Failed to fetch comics. Please try again later.');
        console.error(error.response?.data || error.message); // Log the actual error details
      });

    // Set the favorites from localStorage
    setFavoritesFromLocalStorage();
  }, [setFavoritesFromLocalStorage]);

  // Filter comics based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredComics(comics); // Show all comics if search term is empty
    } else {
      setFilteredComics(
        comics.filter((comic) =>
          comic.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, comics]);

  // Determine which comics to display based on showFavorites
  const comicsToDisplay = showFavorites ? favorites : filteredComics;

  return (
    <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">Marvel Comics</h1>

  {/* Search and Show Favorites button container */}
  <div className="flex items-center justify-between mb-4">
    {/* Search Field */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for comics"
      className="border p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded text-black"
    />

    {/* Button to toggle the favorites section (aligned to the right) */}
    <button
      onClick={() => setShowFavorites(!showFavorites)}
      className="p-2 bg-blue-500 text-white rounded ml-auto"
    >
      {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
    </button>
  </div>

      {/* Comics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {comicsToDisplay.length > 0 ? (
          comicsToDisplay.map((comic) => (
            <div key={comic.id} className="bg-white shadow rounded p-4">
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                className="w-full h-auto"
              />
              <h2 className="text-lg font-semibold mt-2 text-black">{comic.title}</h2>

              {/* Heart icon for adding/removing favorites */}
              <div
                className="mt-2 cursor-pointer"
                onClick={() =>
                  favorites.some((fav) => fav.id === comic.id)
                    ? removeFavorite(comic)
                    : addFavorite(comic)
                }
              >
                {/* Conditional rendering of heart icons */}
                {favorites.some((fav) => fav.id === comic.id) ? (
                  <img
                    src="/heart_filled.png" 
                    alt="Filled Heart"
                    className="w-8 h-8"
                  />
                ) : (
                  <img
                    src="/heart_empty.png" 
                    alt="Empty Heart"
                    className="w-8 h-8"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            {showFavorites ? 'No favorite comics added' : 'No comics found'}
          </div>
        )}
      </div>
    </div>
  );
}
