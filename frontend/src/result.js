import React from "react";
import { Redirect } from "react-router";
import { MovieResult, UserResult, GenreResult } from "./results";
import { validate } from "./validate.js";

class Result extends React.Component {
    _mounted = false;
    
    constructor(props) {
        super(props);
        this.state = {
            search: this.props.match.params.search,
            type: this.props.match.params.type,
        };
    }

    componentDidMount() {
        // We don't want to call the API from here
        // Let's parse the query to see what component to create
        var component;
        if(this.state.type === "movie") {
            // Will always expect a single movie title, pipe to movie component
            component = MovieResult;
        }

        if(this.state.type === "user") {
            // Will have a collection of user ids, pipe to user component
            component = UserResult;
        }

        if(this.state.type === "genre") {
            // Genres are always in a comma seprated list, pipe to genre component
            component = GenreResult;
        }

        if(component !== undefined)
            this.setState({ component: component });
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    } 

    render() {
        // First get if the state is valid
        if (!validate("search", this.state) || !validate("type", this.state)) {
            return <Redirect to="/" />;
        }

        // Wait for mounting...
        if (!this._mounted) {
            return <h1>Loading from server...</h1>;
        }

        // Valid state, render whatever component we have with its properities
        const Component = this.state.component;
        return <Component search={ this.state.search } />;
    }
}

export default Result;
