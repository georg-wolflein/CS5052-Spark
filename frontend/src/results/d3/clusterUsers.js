import { API } from '../api.js'
import { D3Base } from './d3Base.js';
import * as d3 from "d3";

class ClusterUsers extends D3Base {
    constructor(props) {
        super(props);
        this.state = {
            title: "Cluster of user tastes",
            query: this.state.query
        }
    }
    
    callAPI() {
        return new Promise((resolve, reject) => {
            API.getGraphOfMutualMovieViews(this.state.query).then((graph) => {
                // Change the data into a form that d3-force can use
                var data = { edges: [], nodes: [] };
                for(var i = 0; i < graph.nodes['length']; i++) {
                    data.nodes.push({ value: graph.nodes[i] });
                } 

                // For normalization, we should also calculate the maximum & minimum weight
                var max = graph.edges[0]["weight"];
                for(i = 0; i < graph.edges['length']; i++) {
                    if(graph.edges[i]["weight"] > max) max = graph.edges[i]["weight"];
                } for(i = 0; i < graph.edges["length"]; i++) {
                    data.edges.push({ source: graph.edges[i]["to"], target: graph.edges[i]["from"], weight: graph.edges[i]["weight"], normal: (graph.edges[i]["weight"] / max) });
                } this.setState({ graph: data });
                resolve();
            }).catch(() => { reject(); });
        });
    }

    normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    /**
     * Make a force-directed graph of users
     * @see https://observablehq.com/@d3/force-directed-graph
     */
     renderGraph() {
        this.preRenderGraph();

        // The simulation works by applying forces to the nodes
        // The charge foce is much like electrical attraction / replusion, each node is charged with their weight
        const chargeForce = d3.forceManyBody(this.state.graph.edges);
        chargeForce.strength(e => -2 * e.value);
        chargeForce.distanceMin(e => e.value);

        // The simulation also has a link force, pulling the nodes together like a spring
        // And a centering force, pulling them together to the center like gravity
        const sim = d3.forceSimulation(this.state.graph.nodes)
            .force("link", d3.forceLink(this.state.graph.edges).id(d => d.value))
            .force("charge", chargeForce)
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
     
        // The drag function will control how the nodes act when they are dragged
        // The forces are set to follow the mouse when dragged & return when released
        var drag = (sim) => d3.drag()
                .on("start", (e) => {
                    if(!e.active) sim.alphaTarget(0.3).restart();
                    e.subject.fx = e.subject.x;
                    e.subject.fy = e.subject.y;
                }).on("drag", (e) => {
                    e.subject.fx = e.x;
                    e.subject.fy = e.y;
                }).on("end", (e) => {
                    if(!e.active) sim.alphaTarget(0);
                    e.subject.fx = null;
                    e.subject.fy = null;
                });
        
        // Make a tooltip for interaction
        const tooltip = d3.select("#d3Base").append("div")
            .attr("style", "z-index:10;position:absolute;visibility:hidden;padding:10px;background:rgba(0,0,0,0.7);border-radius:3px;color:#fff;")
            .text("");

        // Define the edges of the graph, these edges will be displayed more prominetly when selected
        const edge = this.svg.append("g")
            .attr("stroke", "#999")
            .selectAll("line")
            .data(this.state.graph.edges).join("line")
            .attr("stroke-width", d => d.normal)
            .attr("stroke-opacity", d => d.normal);

        // Display the nodes of the graph, these nodes will be displayed more promintely when selected
        const node = this.svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(this.state.graph.nodes).join("circle")
            .attr("r", 5)
            .attr("fill", "#ee3333")
            .call(drag(sim))
            .on("mouseover", function(d, i) {
                d3.select(this).attr("r", 10).attr("fill", "#cc1111");
                tooltip.html(`User ${i.value}`).style("visibility", "visible");
                edge.attr("stroke-width", e => {
                    if(e.source.value === i.value || e.target.value === i.value) return 3 * e.normal;
                    else return e.normal;
                });
                edge.attr("stroke-opacity", e => {
                    if(e.source.value === i.value || e.target.value === i.value) return 3 + 3 * e.normal;
                    else return e.normal;
                });
            }).on("mousemove", (d) => {
                tooltip.style("top", `${d.pageY + 5}px`)
                    .style("left", `${d.pageX + 5}px`);
            }).on("mouseout", function(d, i) {
                d3.select(this).attr("r", 5).attr("fill", "#ee3333");
                tooltip.html(``).style("visibility", "hidden");
                edge.attr("stroke-width", e => e.normal);
                edge.attr("stroke-opacity", e => e.normal);
            });
        
        // Run the simulation & attach our d3 objects to it so they follow the simulation
        sim.on("tick", () => {
            edge.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }
}

export default ClusterUsers;