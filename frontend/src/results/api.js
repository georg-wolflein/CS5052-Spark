import axios from "axios";

const api = axios.create({
    baseURL: "/api/",
});

export const API = {
    // not used
    getVersion: async () => 
        (await api.get("version")).data,

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

    // TODO: users
    getGenresByUser: async (userId) =>
        (await api.get(`users/${userId}/genres`)).data,

    // movies: done
    topRatedMovies: async (n) => 
        (await api.get(`movies/top/rated/${n}`)).data,

    // movies: done
    topWatchedMovies: async (n) =>
        (await api.get(`movies/top/watched/${n}`)).data,
};
