import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';

/**
 * Users class which handles user API searches
 */
class GenreResult extends BaseResult {
    async callAPI(search) {
        // Ensure each entry is captalized
        var query = search.toLowerCase().replaceAll(" ", "").split(",");
        for(var i = 0; i < query.length; i++) {
            query[i] = query[i].charAt(0).toUpperCase() + query[i].slice(1);
            if(query[i] === "Sci-fi") query[i] = "Sci-Fi";
        } 
        
        // Get the number of genres searched for
        const items = search.match(/,/g) === null ? 1 : search.match(/,/g).length + 1;
        if(items === 1) this.setState({title: "Movies about " + search});
        else this.setState({title: "Movies about [" + search + "]"});

        return new Promise((resolve, reject) => {
            // Call the API
            API.searchMoviesByGenres(query).then((value) => {
                this.pushMovies(value, this.state.movies);
                resolve();
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    
    draw() {
        return (
            <div id="genres">
                <h1>{ this.state.title }</h1><br/>
                <ResultsTable heading={ this.state.heading } data={ this.state.movies } error={ "No movies found" }/>
            </div>
        );
    }
}

export default GenreResult;