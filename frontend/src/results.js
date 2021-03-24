import React from 'react';
import { Redirect } from 'react-router';
import { validate } from './validate.js'

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: this.props.match.params.search,
            type: this.props.match.params.type
        };
    }

    // See componentsDidMount()

    render() {
        // First get if the state is valid
        if(!validate("search", this.state.search) || !validate("type", this.state.type)) {
            return (
                <Redirect to="/" />
            );
        } 
        
        // Valid state, render the results
        return (
            <p>hi {this.state.type} & {this.state.search}</p>
        );
    }
}

export default Results;