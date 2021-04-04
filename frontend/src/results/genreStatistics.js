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
                // Need to transform the data into a nice array to work with
                var data = [];
                for(var i = 0; i < Object.keys(genres).length; i++) {
                    var key = Object.keys(genres)[i];
                    var value = genres[key];
                    data.push({ genre: key, count: value });
                } this.setState({ genres: data });
                resolve();
            });
        }).then(() => {
            this.setState({ loaded: true, success: true });
            this.renderGraph();
        }).catch((error) => {
            console.error(error);
            this.setState({ loaded: true, success: false });
        });
    }

    /**
     * Renders the d3.js graph for genre statistics
     */
    renderGraph() {
        // Make the svg to draw the graph upon responsively
        const height = 600;
        var svg = d3.select("#genreGraph").append("svg").attr("width", "100%").attr("height", height);
        const width = svg.node().getBoundingClientRect().width;

        // Make the x & y axes of data
        const x = d3.scaleBand()
            .domain(d3.map(this.state.genres, d => d.genre))
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.state.genres, d => d.count)])
            .range([height, 0]);
        
        // Add the data to the svg
        svg.selectAll(".bar")
            .data(this.state.genres).enter()
            .append("rect")
            .attr("x", d => x(d.genre))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => (height - y(d.count)));

        // TODO: Labels & colours
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
                <br/>
            </div>
        );
    }
}