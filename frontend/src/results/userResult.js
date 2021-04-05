import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';
import { CompareUsers, GenreStatistics } from './d3';
import { Recommendations } from './recommendations.js';

/**
 * Users class which handles user API searches
 */
class UserResult extends BaseResult {
    async callAPI(search) {
        var query = search.replaceAll(" ", "").split(",");

        // Get the number of users searched for
        const items = search.match(/,/g) === null ? 1 : search.match(/,/g).length + 1;
        if(items === 1) this.setState({title: `Movies watched by user ${search}` });
        else this.setState({title: `Movies watched by users: [${search}]` });
        this.setState({ 
            query: query,
            usersNum: items, 
            favGenre: "Loading...",
         });

        // Call the API
        return new Promise((resolve, reject) => {
            // Call the API for movie statistics
            API.searchMoviesByUsers(query).then((movies) => {
                // Push the movies
                this.pushMovies(movies, this.state.movies);

                // TODO: Graph of viewers here
                resolve();

                // Find the favorite genre
                API.favouriteGenre(query).then((fav) => {
                    this.setState({ favGenre: fav.genre });
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    
    draw() {
        var additional;
        if(this.state.usersNum === 2) {
            // If we have to compare users, show the comparison
            additional = 
                <div id="additional">
                    <br/><hr/><br/>
                    <CompareUsers query={ this.state.query } />
                </div>;
        } else if(this.state.usersNum === 1) {
            // If we have to get genre breakdown, get it
            additional =
                <div id="additional">
                    <br/><hr/><br/>
                    <Recommendations pushMovies={ this.pushMovies } heading={ this.state.heading } userId={ this.state.query } />
                    <br/><hr/><br/>
                    <GenreStatistics query={ this.state.query } />
                </div>;
        } else {
            // TODO display force directed graph here
        }

        // Render everything
        return (
            <div id="users">
                <h1>{ this.state.title }</h1>
                <h3>Favourite genre: { this.state.favGenre }</h3><br/>
                <ResultsTable heading={ this.state.heading } data={ this.state.movies } />
                { additional }
            </div>
        );
    }
}

export default UserResult;