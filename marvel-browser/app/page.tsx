'use client';

import { useEffect, useState } from 'react';
import { Comic } from '../types/types';
import { fetchMarvelData } from '../utils/marvelApi';
import useStore from './store'; 
import TopBar from '@/components/topbar';
import ComicCard from '@/components/ComicCard';

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const comicsPerPage = 12; 

  const { addFavorite, removeFavorite, favorites, setFavoritesFromLocalStorage } = useStore();

  useEffect(() => {
    const params: any = {
      orderBy: '-modified', 
      limit: comicsPerPage, 
      offset: (currentPage - 1) * comicsPerPage,
    };

    if (searchTerm) {
      params.title = searchTerm; 
    }

    fetchMarvelData<Comic>('comics', params)
      .then((data) => {
        setComics(data.data.results);
        setTotalPages(Math.ceil(data.data.total / comicsPerPage)); 
      })
      .catch((error) => console.error('API Request Error:', error)); 

    setFavoritesFromLocalStorage();
  }, [setFavoritesFromLocalStorage, currentPage, searchTerm]); 

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          {comics.length > 0 ? (
            comics.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              {showFavorites ? 'No favorite comics added' : 'No comics found'}
            </div>
          )}
        </div>

        {/* Footer with pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-gray-500">
            {`Page ${currentPage} of ${totalPages}`}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
