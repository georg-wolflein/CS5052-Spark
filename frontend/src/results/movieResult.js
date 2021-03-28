import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';

/**
 * Movies class which handles movie API searches
 */
class MovieResult extends BaseResult {
    async callAPI(search) {
        const query = search.toLowerCase();
        return new Promise((resolve, reject) => {
            // If the query is in the form "top rated [number]", then return the top n
            if(/^top rated \d+$/.test(query)) {
                var rated = query.substring("top rated ".length);
                this.setState({title: "Top rated " + rated + " movies"}); 
                API.topRatedMovies(rated).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // If it's in the form "top watched [number]", return that
            else if(/^top watched \d+$/.test(query)) {
                var watched = query.substring("top watched ".length);
                this.setState({title: "Top watched " + watched + " movies"}); 
                API.topWatchedMovies(watched).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Otherwise, see if the movie title is in the form of a year
            else if(/^\d\d\d\d$/.test(query)) {
                this.setState({title: "Movies in " + query}); 
                API.searchMoviesByYear(query).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Finally, just search by title
            else {
                this.setState({title: "Movies with a title like \"" + search + "\""}); 
                API.searchMoviesByTitle(query).then((value) => {
                    this.pushMovies(value, resolve);
                }).catch((reason) => {
                    reject(reason);
                });
            }
        });
    }

    draw() {
        return (
            <div id="movies">
                <h1>{ this.state.title }</h1><br/>
                <ResultsTable heading={ this.state.heading } data={ this.state.movies } />
            </div>
        );
    }
}

export default MovieResult;