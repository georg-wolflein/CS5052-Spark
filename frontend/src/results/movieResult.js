import React from 'react';
import { API } from './api.js'
import { BaseResult, resultDisplayer } from './baseResult.js';

/**
 * Movies class which handles movie API searches
 */
class Movies extends BaseResult {
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
    
    render() {
        return (
            <h1>Okay {this.movies}</h1>
        );
    }
}

// Export the component using the results displayer function
const MovieResult = resultDisplayer(new Movies());

export default MovieResult;