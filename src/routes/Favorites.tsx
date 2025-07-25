import { IMDBMovie } from '../model/movie';
import MovieCard from '../components/MovieCard';

interface FavoritesProps {
  favorites: IMDBMovie[];
  removeFromFavorites: (movieId: string) => void;
}

const Favorites = ({ favorites, removeFromFavorites }: FavoritesProps) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Favorites Yet</h2>
        <p className="text-gray-500">
          Search for movies and click the favorite toggle on any movie detail page to add them here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Favorite Movies</h1>
        <p className="text-gray-500 mt-2">{favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved</p>
      </div>
      
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {favorites.map((movie) => (
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
            onRemove={removeFromFavorites}
          />
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
