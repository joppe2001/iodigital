import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { IMDBMovie } from '../model/movie';
import { FavoritesContextType } from '../App';

interface ToggleProps {
  movie: IMDBMovie;
  favoritesContext: FavoritesContextType;
}

const Toggle: FunctionComponent<ToggleProps> = ({ movie, favoritesContext }) => {
  const isFavorited = favoritesContext.isFavorite(movie.imdbID);

  const handleToggle = () => {
    if (isFavorited) {
      favoritesContext.removeFromFavorites(movie.imdbID);
    } else {
      favoritesContext.addToFavorites(movie);
    }
  };

  return (
    <div className="flex flex-row-reverse">
      <button
        type="button"
        className={clsx(
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          {
            'bg-green-600': isFavorited,
            'bg-gray-200': !isFavorited
          }
        )}
        role="switch"
        aria-checked={isFavorited}
        onClick={handleToggle}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            {
              'translate-x-5': isFavorited,
              'translate-x-0': !isFavorited
            }
          )}
        ></span>
      </button>
      <b className={clsx('mr-3', {
        'text-green-600': isFavorited,
        'text-gray-700': !isFavorited
      })}>
        Favorite: {isFavorited ? 'Yes' : 'No'}
      </b>
    </div>
  );
};

export default Toggle;
