import { API } from './api.js'
import { BaseResult } from './baseResult.js';
import { ResultsTable } from './resultsTable.js';
import { CompareUsers } from './compareUsers.js';

/**
 * Users class which handles user API searches
 */
class UserResult extends BaseResult {
    async callAPI(search) {
        var query = search.replaceAll(" ", "").split(",");

        // Get the number of users searched for
        const items = search.match(/,/g) === null ? 1 : search.match(/,/g).length + 1;
        if(items === 1) this.setState({title: "Movies watched by user " + search});
        else this.setState({title: "Movies watched by users: [" + search + "]"});
        this.setState({ 
            usersNum: items, 
            favGenre: "Loading...", 
            genres: [],
            genreStatus: "Loading..."
         });

        // Call the API
        return new Promise((resolve, reject) => {
            // Call the API for movie statistics
            API.searchMoviesByUsers(query).then((movies) => {
                // Get genre breakdown if needed
                if(this.state.usersNum === 1) {
                    // Call the API for genre breakdown of single user
                    API.getGenresByUser(query).then((genres) => {
                        for(var i = 0; i < Object.keys(genres).length; i++) {
                            var genre = [];
                            var key = Object.keys(genres)[i];
                            genre.push(key);
                            genre.push(genres[key]);
                            this.state.genres.push(genre);
                        } 
                    }).catch(() => {
                        this.setState({ genreStatus: "An error occured..." });
                    });
                }

                // Find the favorite genre
                API.favouriteGenre(query).then((fav) => {
                    this.setState({ favGenre: fav.genre });
                });

                // Push the movies
                this.pushMovies(movies, resolve);
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
                    <h1>Comparison of movie tastes</h1>
                    <CompareUsers users={ this.state.users } />
                </div>;
        } else if(this.state.usersNum === 1) {
            // If we have to get genre breakdown, get it
            // TODO: This should be its own component
            additional =
                <div id="additional">
                    <br/><hr/><br/>
                    <h1>Genre statistics</h1>
                    { this.state.genres === [] ? ( <p>{ this.state.genreStatus }</p> ) : (
                        <ResultsTable heading={ [ "Genre", "Count" ] } data={ this.state.genres } />
                    )}
                </div>;
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