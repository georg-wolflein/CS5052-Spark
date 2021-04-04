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
            this.setState({ loaded: true, success: false });
        });
    }

    /**
     * Renders the d3.js graph for genre statistics
     */
    renderGraph() {
        // Make the svg to draw the graph upon responsively
        const height = 600;
        const offset = 40;
        var svg = d3.select("#genreGraph").append("svg").attr("width", "100%").attr("height", height);
        const width = svg.node().getBoundingClientRect().width;

        // Make the x & y axes of data
        const x = d3.scaleBand()
            .domain(d3.map(this.state.genres, d => d.genre))
            .range([offset, width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.state.genres, d => d.count)])
            .range([height - offset, offset / 2]);

        // Make a tooltip for interaction
        const tooltip = d3.select("#genreGraph").append("div")
            .attr("style", "z-index:10;position:absolute;visibility:hidden;padding:10px;background:rgba(0,0,0,0.7);border-radius:3px;color:#fff;")
            .text("");

        // Add the data to the svg
        svg.selectAll("g")
            .data(this.state.genres).enter()
            .append("rect")
            .attr("fill", "#ee3333")
            .attr("x", d => x(d.genre))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => (height - offset - y(d.count)))
            .on("mouseover", function(d, i) {
                tooltip.html(`${i.genre}: ${i.count}`).style("visibility", "visible");
                d3.select(this).attr("fill", "#cc1111");
            }).on("mousemove", (d) => {
                tooltip.style("top", `${d.pageY + 5}px`)
                    .style("left", `${d.pageX + 5}px`);
            }).on("mouseout", function(d, i) {
                tooltip.html(``).style("visibility", "hidden");
                d3.select(this).attr("fill", "#ee3333");
            });
        
        // Append the x axis labels to the chart
        svg.selectAll("g")
            .data(this.state.genres).enter()
            .append("text")
            .attr("dominant-baseline", "text-before-edge")
            .attr("text-anchor", "middle")
            .attr("fill", "#000000")
            .attr("x", d => x(d.genre) + offset * 0.7)
            .attr("y", height - offset + 5)
            .attr("style", "font-family:Arial;font-size:11")
            .text(d => d.genre);
    
        // Add the y axis to the chart
        svg.append("g").call(d3.axisRight(y));
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
        return (
            <div id="genreStats">
                <h1>Genre statistics</h1>
                <div id="genreGraph"></div>
                <br/>
            </div>
        );
    }
}