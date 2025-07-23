import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Search from './components/Search';
import Home from './routes/Home';
import Detail from './routes/Detail';
import Edit from './routes/Edit';
import Favorites from './routes/Favorites';
import { IMDBMovie } from './model/movie';

export interface FavoritesContextType {
  favorites: IMDBMovie[];
  addToFavorites: (movie: IMDBMovie) => void;
  removeFromFavorites: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AppContent = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<IMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<IMDBMovie[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('moviedb-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moviedb-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie: IMDBMovie) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (movieId: string) => {
    setFavorites(prev => prev.filter(fav => fav.imdbID !== movieId));
  };

  const isFavorite = (movieId: string) => {
    return favorites.some(fav => fav.imdbID === movieId);
  };

  const favoritesContext: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  const searchMovies = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    navigate('/');
    
    try {
      const API_KEY = '1a993ee0';
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        const movies: IMDBMovie[] = data.Search.map((movie: any) => ({
          Title: movie.Title,
          Year: movie.Year,
          imdbID: movie.imdbID,
          Type: movie.Type,
          Poster: movie.Poster,
        }));
        setSearchResults(movies);
      } else {
        setError(data.Error || 'No movies found');
        setSearchResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <header className="bg-white shadow-sm lg:static lg:overflow-y-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
            <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
              <div className="flex-shrink-0 flex items-center">
                <a href="#">MovieDB</a>
              </div>
            </div>
            <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
              <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                <Search onSearch={searchMovies} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav
              aria-label="Sidebar"
              className="sticky top-4 divide-y divide-gray-300"
            >
              <div className="pb-8 space-y-1">
                <Link
                  to="/"
                  className="text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  Home
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  Favorites ({favorites.length})
                </Link>
              </div>
            </nav>
          </div>
          <main className="lg:col-span-9">
            <Routes>
              <Route 
                path="/" 
                element={<Home movies={searchResults} loading={loading} error={error} />} 
              />
              <Route 
                path="/detail/:id" 
                element={<Detail favoritesContext={favoritesContext} />} 
              />
              <Route path="/edit/:id" element={<Edit />} />
              <Route 
                path="/favorites" 
                element={<Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
