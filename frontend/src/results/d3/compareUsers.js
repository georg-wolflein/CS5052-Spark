import { API } from '../api.js'
import { D3Base } from './d3Base.js';
import * as d3 from "d3";

class CompareUsers extends D3Base {
    constructor(props) {
        super(props);
        this.state = {
            title: "Compare Users " + this.state.query[0] + " & " + this.state.query[1],
            user1: this.state.query[0],
            user2: this.state.query[1],
            query: this.state.query
        }
    }

    callAPI() {
        return new Promise((resolve, reject) => {
            API.compareMovieTastes(this.state.query[0], this.state.query[1]).then((percents) => {
                var data = [];
                for(var i = 0; i < percents.length; i++) {
                    var key = percents[i].genre;
                    var value = percents[i].percentage_user1;
                    var value2 = percents[i].percentage_user2;
                    data.push({ genre: key, [`User ${this.state.user1}`]: value, [`User ${this.state.user2}`]: value2 });
                } this.setState({ data: data });
                resolve();
            }).catch(() => { reject(); });
        });
    }

    renderGraph() {
        this.preRenderGraph();
        const subgroups = [`User ${this.state.user1}`, `User ${this.state.user2}`];

        // Make the x, subgroup & y axes
        const x = d3.scaleBand()
            .domain(d3.map(this.state.data, d => d.genre))
            .range([this.offset, this.width])
            .padding(0.1);
        
        const xSub = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding(0.05);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.state.data, d => d[subgroups[0]] + d[subgroups[1]])])
            .range([this.height - this.offset, this.offset / 2]);

        // Define colors for when hovering & not
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#ee3333", "#3377bb"]);

        const selectcolor = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#cc1111", "#115599"]);

        // Make a tooltip for interaction
        const tooltip = d3.select("#d3Base").append("div")
            .attr("style", "z-index:10;position:absolute;visibility:hidden;padding:10px;background:rgba(0,0,0,0.7);border-radius:3px;color:#fff;")
            .text("");

        // Add the data to the svg
        this.svg.selectAll("g")
            .data(this.state.data).enter()
            .append("g")
            .attr("transform", d => `translate(${x(d.genre)}, 0)`)
            .selectAll("rect")
            .data(d => subgroups.map(key => { return { key: key, value: d[key], genre: d.genre } } )).enter()
            .append("rect")
            .attr("fill", d => color(d.key))
            .attr("x", d => xSub(d.key))
            .attr("y", d => y(d.value))
            .attr("width", xSub.bandwidth())
            .attr("height", d => (this.height - this.offset - y(d.value)))
            .on("mouseover", function(d, i) {
                tooltip.html(`${i.key} for ${i.genre}: ${i.value.toFixed(2)}%`).style("visibility", "visible");
                d3.select(this).attr("fill", d => selectcolor(d.key));
            }).on("mousemove", (d) => {
                tooltip.style("top", `${d.pageY + 5}px`)
                    .style("left", `${d.pageX + 5}px`);
            }).on("mouseout", function(d, i) {
                tooltip.html(``).style("visibility", "hidden");
                d3.select(this).attr("fill", d => color(d.key));
            });
        
        // Append the x axis labels to the chart
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - this.offset})`)
            .call(d3.axisBottom(x));
    
        // Add the y axis to the chart
        this.svg.append("g").call(d3.axisRight(y));
    }
}

export default CompareUsers;