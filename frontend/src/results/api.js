import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

export const API = {
  // not used
  getVersion: async () => (await api.get("version")).data,

  // movies: done
  searchMoviesByTitle: async (title) =>
    (await api.get("movies/search/title", { params: { title } })).data,

  // movies: done
  searchMoviesByYear: async (year) =>
    (await api.get("movies/search/year", { params: { year } })).data,

  // users: done
  searchMoviesByUsers: async (users) =>
    (await api.post("movies/search/users", users)).data,

  // genres: done
  searchMoviesByGenres: async (genres) =>
    (await api.post("movies/search/genres", genres)).data,

  // users: done
  getGenresByUser: async (userId) =>
    (await api.get(`users/${userId}/genres`)).data,

  // additional info: done
  getWatched: async (movieId) => (await api.get(`movies/${movieId}/watched`)).data,

  // additional info: done
  getRating: async (movieId) => (await api.get(`movies/${movieId}/rating`)).data,

  // movies: done
  topRatedMovies: async (n) => (await api.get(`movies/top/rated/${n}`)).data,

  // movies: done
  topWatchedMovies: async (n) =>
    (await api.get(`movies/top/watched/${n}`)).data,

  // users: done
  favouriteGenre: async (users) =>
    (await api.post("users/favourite/genre", users)).data,

  // TODO: vis
  compareMovieTastes: async (user1, user2) =>
    (await api.get(`users/compare/${user1}/${user2}/genres`)).data,

  // TODO: graph
  getGraphOfMutualMovieViews: async (...users) =>
    (await api.post("users/graph/mutual_views", users)).data,

  // TODO: users
  getRecommendations: async (userId) =>
    (await api.get(`users/${userId}/recommendations`)).data,
};
