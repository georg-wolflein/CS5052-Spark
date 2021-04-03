import React from 'react';
import { API } from './api.js'

export class AdditionalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            movieId: this.props.movieId,
            hasClicked: false
        }
    }

    /**
     * Upon click, call the API to get information about the movie
     */
    onClick() {
        this.setState({ hasClicked: true });
        new Promise((resolve, reject) => {
            // Get the rating & the watchers
            API.getRating(this.state.movieId).then((rating) => {
                API.getWatched(this.state.movieId).then((watched) => {
                    this.setState({ rating: rating.toFixed(2), watched: watched });
                    resolve();
                });
            }).catch(() => { reject(); });
        }).then(() => {
            this.setState({ loaded: true, success: true });
        }).catch(() => {
            this.setState({ loaded: true, success: false });
        });
    }

    render() {
        // If clicked, render info about the movie
        if(this.state.hasClicked) {
            if(!this.state.loaded) return (
                <p>Waiting on server...</p>
            );

            if(!this.state.success) return (
                <p>An error occured...</p>
            );

            return (
                <p><b>Rating</b>: { this.state.rating } / 5 <br/> <b>Watched by</b>: { this.state.watched }</p>
            );
        } 

        // Otherwise, display the prompt
        return (
            <a href={ void(0) } role="button" onClick={ this.onClick }>Click to view</a>
        );
    }
}