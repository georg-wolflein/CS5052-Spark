import React from 'react';
import { BaseResult, resultDisplayer } from './baseResult.js';

/**
 * Movies class which handles movie API searches
 */
class Movies extends BaseResult {
    async callAPI() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.okay = "okfsdfday";
                resolve();
            }, 2000);
        });
    }
    
    render() {
        return (
            <h1>Okay {this.okay}</h1>
        );
    }
}

// Export the component using the results displayer function
const MovieResult = resultDisplayer(new Movies());

export default MovieResult;