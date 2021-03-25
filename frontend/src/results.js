import React from "react";
import { Redirect } from "react-router";
import MovieResult from "./results/movieResult.js";
import { validate } from "./validate.js";

class Results extends React.Component {
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
        this.setState({ component: MovieResult });
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

export default Results;
