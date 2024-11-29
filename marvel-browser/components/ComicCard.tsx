import { Comic } from '../types/types';

interface ComicCardProps {
  comic: Comic;
  favorites: Comic[];
  addFavorite: (comic: Comic) => void;
  removeFavorite: (comic: Comic) => void;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, favorites, addFavorite, removeFavorite }) => {
  const isFavorite = favorites.some((fav) => fav.id === comic.id);

  return (
    <div className="bg-white shadow rounded p-4">
      <img
        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
        alt={comic.title}
        className="w-full h-auto"
      />
      <h2 className="text-lg font-semibold mt-2 text-black">{comic.title}</h2>

      <div
        className="mt-2 cursor-pointer"
        onClick={() => (isFavorite ? removeFavorite(comic) : addFavorite(comic))}
      >
        <img
          src={isFavorite ? "/heart_filled.png" : "/heart_empty.png"}
          alt={isFavorite ? "Filled Heart" : "Empty Heart"}
          className="w-8 h-8"
        />
      </div>
    </div>
  );
};

export default ComicCard;
