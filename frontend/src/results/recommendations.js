import React from 'react';
import { API } from './api.js'
import { ResultsTable } from './resultsTable.js';

export class Recommendations extends React.Component {
    _mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            pushMovies: this.props.pushMovies,
            heading: this.props.heading,
            title: `Recommended movies for user ${this.props.userId}`,
            recs: []
        }
    }

    /**
     * Called when mounted
     * Call the API
     */
    componentDidMount() {
        // Here, call the API function given to us & then mount the component
        this._mounted = true;
        new Promise((resolve, reject) => {
            API.getRecommendations(this.state.userId).then((recs) => {
                this.state.pushMovies(recs, this.state.recs);
                resolve();
            });
        }).then(() => {
            if(this._mounted) this.setState({ success: true, loaded: true });
        }).catch((reason) => {
            if(this._mounted) this.setState({ success: false, reason: reason.toString(), loaded: true });
        });
    }

    /**
     * Called when this component is unmounted
     */
    componentWillUnmount() {
        this._mounted = false;
    }


    render() {
        // If clicked, render info about the movie
        if(!this.state.loaded) return (
            <div id="recs">
                <h1>{ this.state.title }</h1>
                <p>Waiting on server...</p>
            </div>
        );

        if(!this.state.success) return (
            <div id="recs">
                <h1>{ this.state.title }</h1>
                <p>An error occured...</p>
            </div>
        );

        return (
            <div id="recs">
                <h1>{ this.state.title }</h1>
                <ResultsTable heading={ this.state.heading } data={ this.state.recs } />
            </div>
        );
        
    }
}