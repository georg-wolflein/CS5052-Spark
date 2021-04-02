import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

export const API = {
  getVersion: async () => (await api.get("version")).data,
  searchMoviesByTitle: async (title) =>
    (await api.get("movies/search/title", { params: { title } })).data,
  searchMoviesByYear: async (year) =>
    (await api.get("movies/search/year", { params: { year } })).data,
  searchMoviesByUsers: async (users) =>
    (await api.post("movies/search/users", users)).data,
  searchMoviesByGenres: async (genres) =>
    (await api.post("movies/search/genres", genres)).data,
  getNumberOfViews: async (movieId) =>
    (await api.get(`movies/${movieId}/watched`)).data,
  getRating: async (movieId) =>
    (await api.get(`movies/${movieId}/rating`)).data,
  topRatedMovies: async (n) => (await api.get(`movies/top/rated/${n}`)).data,
  topWatchedMovies: async (n) =>
    (await api.get(`movies/top/watched/${n}`)).data,
  favouriteGenre: async (...users) =>
    (await api.post("users/favourite/genre", users)).data,
  compareMovieTastes: async (user1, user2) =>
    (await api.get(`users/compare/${user1}/${user2}/genres`)).data,
};
