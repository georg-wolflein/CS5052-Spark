import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';
import { CompareUsers, GenreStatistics, ClusterUsers } from './d3';
import { Recommendations } from './recommendations.js';

/**
 * Users class which handles user API searches
 */
class UserResult extends BaseResult {
    async callAPI(search) {
        // Get a list of user ids & the number of them
        var query = search.replaceAll(" ", "");
        if(query.includes("-")) {
            query = query.split("-");
            var data = [];
            for(var i = query[0]; i <= query[1]; i++) {
                data.push(i);
            } query = data;
        } else if(query.includes(",")) {
            query = query.split(",");
        } else {
            query = [query];
        } const items = query.length;

        // Get the number of users searched for
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
        if(this.state.usersNum === 1) {
            // If we have one user, display recommendations / breakdown
            additional = <div id="additional">
                    <Recommendations pushMovies={ this.pushMovies } heading={ this.state.heading } userId={ this.state.query } />
                    <br/><hr/><br/>
                    <GenreStatistics query={ this.state.query } />
                </div>;
            
        } else if(this.state.usersNum === 2) {
            // If we have two, display the graph to compare them
            additional = <CompareUsers query={ this.state.query } />;
        } else {
            // Otherwise, display the force connected graph for them
            additional = <ClusterUsers query={ this.state.query } />;
        }

        // Render everything
        return (
            <div id="users">
                <h1>{ this.state.title }</h1>
                <h3>Favourite genre: { this.state.favGenre }</h3><br/>
                <ResultsTable heading={ this.state.heading } data={ this.state.movies } />
                <br/><hr/><br/>
                { additional }
            </div>
        );
    }
}

export default UserResult;