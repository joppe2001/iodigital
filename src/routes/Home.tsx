import { FunctionComponent } from 'react';
import { IMDBMovie } from '../model/movie';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

interface HomeProps {
  movies: IMDBMovie[];
  loading: boolean;
  error: string | null;
}

const Home: FunctionComponent<HomeProps> = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error}</div>
        <p className="text-gray-500 mt-2">Try searching for a different movie.</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to MovieDB</h2>
        <p className="text-gray-500">Search for movies using the search bar above to get started.</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
};

export default Home;
