import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { IMDBMovie } from '../model/movie';

interface MovieCardProps {
  movie: IMDBMovie;
  onRemove?: (movieId: string) => void;
}

const MovieCard: FunctionComponent<MovieCardProps> = ({ movie, onRemove }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(movie.imdbID);
    }
  };

  return (
    <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200 relative">
      <div className="flex-1 flex flex-col">
        <img 
          className="h-48 w-full object-cover mx-auto mt-4 rounded-lg" 
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
          alt={movie.Title}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-movie.jpg';
          }}
        />
        <div className="p-4">
          <h3 className="mt-6 text-gray-900 text-sm font-medium">{movie.Title}</h3>
          <dl className="mt-1 flex-grow flex flex-col justify-between">
            <dd className="text-gray-500 text-sm">{movie.Year}</dd>
          </dl>
          
          {onRemove ? (
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/detail/${movie.imdbID}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleRemove}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <Link
                to={`/detail/${movie.imdbID}`}
                className="text-rose-600 hover:text-rose-500 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default MovieCard;
