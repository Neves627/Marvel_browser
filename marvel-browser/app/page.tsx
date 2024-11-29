'use client';

import { useEffect, useState } from 'react';
import { Comic } from '../types/types';
import { fetchMarvelData } from '../utils/marvelApi';
import useStore from './store'; 
import TopBar from '@/components/topbar';


export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const { addFavorite, removeFavorite, favorites, setFavoritesFromLocalStorage } = useStore();

  useEffect(() => {
    fetchMarvelData<Comic>('comics', { orderBy: '-modified', limit: 30 })
      .then((data) => setComics(data.data.results))
      .catch((error) => {
        console.error(error.response?.data || error.message);
      });

    setFavoritesFromLocalStorage();
  }, [setFavoritesFromLocalStorage]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredComics(comics);
    } else {
      setFilteredComics(
        comics.filter((comic) =>
          comic.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, comics]);

  const comicsToDisplay = showFavorites ? favorites : filteredComics;

  return (
    <div className="p-4">
      {/* Topbar */}
      <TopBar />

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for comics"
            className="border p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded text-black"
          />

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="p-2 bg-blue-500 text-white rounded ml-auto"
          >
            {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
          </button>
        </div>

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

                <div
                  className="mt-2 cursor-pointer"
                  onClick={() =>
                    favorites.some((fav) => fav.id === comic.id)
                      ? removeFavorite(comic)
                      : addFavorite(comic)
                  }
                >
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
    </div>
  );
}
