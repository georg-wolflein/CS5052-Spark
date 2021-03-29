import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';
import { CompareUsers } from './compareUsers.js';

/**
 * Users class which handles user API searches
 */
class UserResult extends BaseResult {
    async callAPI(search) {
        var query = search.replace(" ", "").split(",");

        // Get the number of users searched for
        const items = search.match(/,/g) === null ? 1 : search.match(/,/g).length + 1;
        if(items === 1) this.setState({title: "Movies watched by user " + search});
        else this.setState({title: "Movies watched by users: [" + search + "]"});
        this.setState({ users: query });

        return new Promise((resolve, reject) => {            
            // TODO: Given a user, get the number of movies watched per genre

            // Call the API
            API.searchMoviesByUsers(query).then((value) => {
                this.pushMovies(value, resolve);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    
    draw() {
        // If we have to compare users, show the comparison
        if(this.users !== null) {
            return (
                <div id="users">
                    <h1>{ this.state.title }</h1><br/>
                    <ResultsTable heading={ this.state.heading } data={ this.state.movies } />
                    <br/><hr/><br/>
                    <h1>Comparison of users { this.state.users[0] } & { this.state.users[1] }</h1>
                    <CompareUsers users={ this.state.users } />
                </div>
            )
        }

        // Otherwise, just show statistics
        else return (
            <div id="users">
                <h1>{ this.state.title }</h1><br/>
                <ResultsTable heading={ this.state.heading } data={ this.state.movies } />
            </div>
        );
    }
}

export default UserResult;