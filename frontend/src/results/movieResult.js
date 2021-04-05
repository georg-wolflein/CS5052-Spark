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
            // If the query is in the form "top [number] rated", then return the top n
            if(/^top \d+ rated$/.test(query)) {
                var rated = query.substring("top ".length, query.indexOf(" rated"));
                this.setState({title: "Top " + rated + " rated movies"}); 
                API.topRatedMovies(rated).then((value) => {
                    this.pushMovies(value, this.state.movies);
                    resolve();
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // If it's in the form "top [rated] watched", return that
            else if(/^top \d+ watched$/.test(query)) {
                var watched = query.substring("top ".length, query.indexOf(" watched"));
                this.setState({title: "Top " + watched + " watched movies"}); 
                API.topWatchedMovies(watched).then((value) => {
                    this.pushMovies(value, this.state.movies);
                    resolve();
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Otherwise, see if the movie title is in the form of a year
            else if(/^\d\d\d\d$/.test(query)) {
                this.setState({title: "Movies in " + query}); 
                API.searchMoviesByYear(query).then((value) => {
                    this.pushMovies(value, this.state.movies);
                    resolve();
                }).catch((reason) => {
                    reject(reason);
                });
            }

            // Finally, just search by title
            else {
                this.setState({title: "Movies with a title like \"" + search + "\""}); 
                API.searchMoviesByTitle(query).then((value) => {
                    this.pushMovies(value, this.state.movies);
                    resolve();
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