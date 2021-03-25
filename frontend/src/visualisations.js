import React from 'react';
import * as d3 from "d3";

class Visualisations extends React.Component {
    componentDidMount() {
        this.renderCluster();
    }

    // TODO: Very simple bar graph just to show how it will work
    renderCluster() {
        const data = [12, 5, 6, 6, 9, 10];
        const svg = d3.select("#cluster").append("svg").attr("height", 360);
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
    
    render() {
        return (
            <div id="visualisations">
                <h1>Visualisations</h1>
                <h3>Cluster visualisation</h3>
                <div id="cluster"></div>
            </div>
        );
    }
}

export default Visualisations;