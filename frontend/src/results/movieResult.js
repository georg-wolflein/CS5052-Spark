import { API } from './api.js'
import { BaseResult } from './baseResult.js';

/**
 * Movies class which handles movie API searches
 */
class MovieResult extends BaseResult {
    async callAPI(search) {
        return new Promise((resolve, reject) => {
            API.searchMoviesByTitle(search).then((value) => {
                this.movies = [];
                for(const movie of value) {
                    this.movies.push(movie.title);
                } resolve();
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    
    draw() {
        return (
            <h1>Okay {this.movies}</h1>
        );
    }
}

export default MovieResult;