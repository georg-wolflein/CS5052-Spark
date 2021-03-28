import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';

/**
 * Movies class which handles movie API searches
 */
class MovieResult extends BaseResult {
    async callAPI(search) {
        this.title = "";
        this.movies = [];
        this.heading = [ "Title", "Year", "Genres", "Average Rating", "Watched" ];

        const query = search.toLowerCase();
        return new Promise((resolve, reject) => {
            // If the query is in the form "top rated [number]", then return the top n
            if(/^top rated \d+$/.test(query)) {
                var number = query.substring("top rated ".length);
                this.title = "Top rated " + number + " movies"; 
                API.topRatedMovies(number).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // If it's in the form "top watched [number]", return that
            else if(/^top watched \d+$/.test(query)) {
                var number = query.substring("top watched ".length);
                this.title = "Top watched " + number + " movies"; 
                API.topWatchedMovies(number).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Otherwise, see if the movie title is in the form of a year
            else if(/^\d\d\d\d$/.test(query)) {
                this.title = "Movies in " + query; 
                API.searchMoviesByYear(query).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Finally, just search by title
            else {
                this.title = "Movies with a title like \"" + search + "\""; 
                API.searchMoviesByTitle(query).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }
        });
    }
    
    pushMovies(movies, cb) {
        for(const rawMovie of movies) {
            var movie = [];

            // The title & year
            movie.push(rawMovie.title);
            movie.push(rawMovie.year);

            // The genres
            var genres = "";
            for(const genre of rawMovie.genres) {
                genres += genre + ", ";
            } movie.push(genres.substring(0, genres.length - 2));

            // Rating
            movie.push("tbd");

            // Watched
            movie.push("tbd");

            // Finally push the list to be rendered
            this.movies.push(movie);
        } cb();
    }

    draw() {
        return (
            <div id="movies">
                <h1>{ this.title }</h1><br/>
                <ResultsTable heading={ this.heading } data={ this.movies } />
            </div>
        );
    }
}

export default MovieResult;