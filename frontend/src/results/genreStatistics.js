import React from 'react';
import { API } from './api.js'
import * as d3 from "d3";

export class GenreStatistics extends React.Component {
    _mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            query: this.props.query,
            loaded: false,
            success: false,
            genres: []
        }
    }

    /**
     * Called when the component mounts
     * Call the API & catch any errors that may have happened
     */
     componentDidMount() {
        // Here, call the API function given to us & then mount the component
        this._mounted = true;
        new Promise((resolve, reject) => {
            API.getGenresByUser(this.state.query).then((genres) => {
                this.setState({ genres: genres });
                resolve();
            });
        }).then(() => {
            this.setState({ loaded: true, success: true });
            this.renderGraph();
        }).catch(() => {
            this.setState({ loaded: true, success: false });
        });
    }

    /**
     * Renders the d3.js graph for genre statistics
     */
    renderGraph() {
        // TODO: Actully display something using d3.js
        const data = [12, 5, 6, 6, 9, 11];
        const svg = d3.select("#genreGraph").append("svg").attr("height", 360);
        svg.selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", (d, i) => i * 40)
           .attr("y", 0)
           .attr("width", 25)
           .attr("height", (d, i) => d * 10)
           .attr("fill", "red");
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
            <div id="genreStats">
                <h1>Genre statistics</h1>
                <p>Waiting on server...</p>
            </div>
        );

        if(!this.state.success) return (
            <div id="genreStats">
                <h1>Genre statistics</h1>
                <p>An error occured...</p>
            </div>
        );

        // Display with d3.js
        console.log(this.state.genres);
        return (
            <div id="genreStats">
                <h1>Genre statistics</h1>
                <div id="genreGraph"></div>
            </div>
        );
    }
}