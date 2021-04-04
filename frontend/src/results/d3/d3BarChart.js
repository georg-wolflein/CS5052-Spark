import React from 'react';
import * as d3 from "d3";

export class D3BarChart extends React.Component {
    _mounted = false;

    constructor(props) {
        super(props);
        this.state = {
            query: this.props.query,
            loaded: false,
            success: false,
            data: []
        }        
    }

    /**
     * Setup things before rendering the graph
     * Should always be called before rendering
     */
    preRenderGraph() {
        this.height = 600;
        this.offset = 40;
        this.svg = d3.select("#d3BarChart").append("svg").attr("width", "100%").attr("height", this.height);
        this.width = this.svg.node().getBoundingClientRect().width;
    }

    /**
     * Draw a default interactive bar chart
     * overwrite this, selecting `#d3BarChart`, to render a different bar chart
     */
    renderGraph() {
        this.preRenderGraph();

        // Make the x & y axes of data
        const x = d3.scaleBand()
            .domain(d3.map(this.state.data, d => d.key))
            .range([this.offset, this.width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.state.data, d => d.value)])
            .range([this.height - this.offset, this.offset / 2]);

        // Make a tooltip for interaction
        const tooltip = d3.select("#d3BarChart").append("div")
            .attr("style", "z-index:10;position:absolute;visibility:hidden;padding:10px;background:rgba(0,0,0,0.7);border-radius:3px;color:#fff;")
            .text("");

        // Add the data to the svg
        this.svg.selectAll("g")
            .data(this.state.data).enter()
            .append("rect")
            .attr("fill", "#ee3333")
            .attr("x", d => x(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => (this.height - this.offset - y(d.value)))
            .on("mouseover", function(d, i) {
                tooltip.html(`${i.key}: ${i.value}`).style("visibility", "visible");
                d3.select(this).attr("fill", "#cc1111");
            }).on("mousemove", (d) => {
                tooltip.style("top", `${d.pageY + 5}px`)
                    .style("left", `${d.pageX + 5}px`);
            }).on("mouseout", function(d, i) {
                tooltip.html(``).style("visibility", "hidden");
                d3.select(this).attr("fill", "#ee3333");
            });
        
        // Append the x axis labels to the chart
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - this.offset})`)
            .call(d3.axisBottom(x));
    
        // Add the y axis to the chart
        this.svg.append("g").call(d3.axisRight(y));
    }

    /**
     * Call the API to make our data
     * By default, the data should be placed in this.state.data, and contain an array of key, value objects
     * @returns a promise to call the API
     */
    callAPI() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Called when the component mounts
     * Call the API & catch any errors that may have happened
     */
     componentDidMount() {
        // Here, call the API function given to us & then mount the component
        this._mounted = true;
        this.callAPI().then(() => {
            this.setState({ loaded: true, success: true });
            this.renderGraph();
        }).catch((error) => {
            console.error(error);
            this.setState({ loaded: true, success: false });
        });
    }

    /**
     * Called when this component is unmounted
     */
    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        // If not loaded, display
        if(!this.state.loaded) return (
            <div id="stats">
                <h1>{ this.state.title }</h1>
                <p>Waiting on server...</p>
            </div>
        );

        if(!this.state.success) return (
            <div id="stats">
                <h1>{ this.state.title }</h1>
                <p>An error occured...</p>
            </div>
        );

        // Display with d3.js
        return (
            <div id="stats">
                <h1>{ this.state.title }</h1>
                <div id="d3BarChart"></div>
                <br/>
            </div>
        );
    }
}

export default D3BarChart;