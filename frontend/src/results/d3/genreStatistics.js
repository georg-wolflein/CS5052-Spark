import { API } from '../api.js'
import { D3Base } from './d3Base.js';
import * as d3 from "d3";

class GenreStatistics extends D3Base {
    constructor(props) {
        super(props);
        this.state = {
            title: "Genre Statistics",
            query: this.state.query
        }
    }
    
    callAPI() {
        return new Promise((resolve, reject) => {
            API.getGenresByUser(this.state.query).then((genres) => {
                // Need to transform the data into a nice array to work with
                var data = [];
                for(var i = 0; i < Object.keys(genres).length; i++) {
                    var key = Object.keys(genres)[i];
                    var value = genres[key];
                    data.push({ key: key, value: value });
                } this.setState({ data: data });
                resolve();
            }).catch(() => { reject(); });
        });
    }

    /**
     * Draw a default interactive bar chart
     * overwrite this, selecting `#d3Base`, to render a different bar chart
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
        const tooltip = d3.select("#d3Base").append("div")
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
}

export default GenreStatistics;