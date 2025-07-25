import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IMDBMovie } from '../model/movie';
import { FavoritesContextType } from '../App';
import Toggle from '../components/Toggle';
import Spinner from '../components/Spinner';

interface DetailProps {
  favoritesContext: FavoritesContextType;
}

const Detail = ({ favoritesContext }: DetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<IMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMovie, setEditedMovie] = useState<IMDBMovie | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        setError('Movie ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const API_KEY = '1a993ee0';
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();

        if (data.Response === 'True') {
          setMovie(data);
          setEditedMovie(data);
        } else {
          setError(data.Error || 'Movie not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMovie(movie);
  };

  const handleSave = () => {
    if (editedMovie) {
      setMovie(editedMovie);
      setIsEditing(false);
      
      if (favoritesContext.isFavorite(editedMovie.imdbID)) {
        favoritesContext.removeFromFavorites(editedMovie.imdbID);
        favoritesContext.addToFavorites(editedMovie);
      }
      
    }
  };

  const handleInputChange = (field: keyof IMDBMovie, value: string) => {
    if (editedMovie) {
      setEditedMovie({
        ...editedMovie,
        [field]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error || 'Movie not found'}</div>
        <Link to="/" className="text-rose-600 hover:text-rose-500 mt-4 inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  const currentMovie = isEditing ? editedMovie : movie;

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div>
            <div className="w-full aspect-w-1 aspect-h-1">
              <img 
                className="w-full h-full object-center object-cover sm:rounded-lg" 
                src={currentMovie?.Poster !== 'N/A' ? currentMovie?.Poster : '/placeholder-movie.jpg'}
                alt={currentMovie?.Title}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.jpg';
                }}
              />
            </div>
          </div>
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <Toggle movie={movie} favoritesContext={favoritesContext} />
            
            {isEditing ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editedMovie?.Title || ''}
                  onChange={(e) => handleInputChange('Title', e.target.value)}
                  className="text-3xl font-extrabold tracking-tight text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {currentMovie?.Title}
              </h1>
            )}

            {isEditing ? (
              <div className="mt-3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  value={editedMovie?.Year || ''}
                  onChange={(e) => handleInputChange('Year', e.target.value)}
                  className="text-3xl text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-3xl text-gray-900">{currentMovie?.Year}</p>
              </div>
            )}

            {isEditing ? (
              <div className="mt-3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Actors</label>
                <input
                  type="text"
                  value={editedMovie?.Actors || ''}
                  onChange={(e) => handleInputChange('Actors', e.target.value)}
                  className="text-xl text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-xl text-gray-900"><strong>Actors:</strong> {currentMovie?.Actors}</p>
              </div>
            )}

            {isEditing ? (
              <div className="mt-3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                <input
                  type="text"
                  value={editedMovie?.Director || ''}
                  onChange={(e) => handleInputChange('Director', e.target.value)}
                  className="text-lg text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-lg text-gray-700"><strong>Director:</strong> {currentMovie?.Director}</p>
              </div>
            )}

            {isEditing ? (
              <div className="mt-3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <input
                  type="text"
                  value={editedMovie?.Genre || ''}
                  onChange={(e) => handleInputChange('Genre', e.target.value)}
                  className="text-lg text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-lg text-gray-700"><strong>Genre:</strong> {currentMovie?.Genre}</p>
              </div>
            )}

            {isEditing ? (
              <div className="mt-3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Runtime</label>
                <input
                  type="text"
                  value={editedMovie?.Runtime || ''}
                  onChange={(e) => handleInputChange('Runtime', e.target.value)}
                  className="text-lg text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-lg text-gray-700"><strong>Runtime:</strong> {currentMovie?.Runtime}</p>
              </div>
            )}

            <div className="mt-3">
              <p className="text-lg text-gray-700"><strong>IMDB Rating:</strong> {currentMovie?.imdbRating}/10</p>
            </div>

            {isEditing ? (
              <div className="mt-6 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plot</label>
                <textarea
                  value={editedMovie?.Plot || ''}
                  onChange={(e) => handleInputChange('Plot', e.target.value)}
                  rows={4}
                  className="text-base text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6">
                  <p><strong>Plot:</strong> {currentMovie?.Plot}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <Link 
                to="/" 
                className="text-rose-600 hover:text-rose-500 font-medium"
              >
                ← Back to Search
              </Link>
              
              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-500 font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEdit}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Edit Movie →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

