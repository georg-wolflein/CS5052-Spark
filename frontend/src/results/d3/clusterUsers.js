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
                var data = { edges: [], nodes: [] };
                for(var i = 0; i < graph.nodes['length']; i++) {
                    data.nodes.push({ value: graph.nodes[i] });
                } for(i = 0; i < graph.edges["length"]; i++) {
                    data.edges.push({ source: graph.edges[i]["to"], target: graph.edges[i]["from"], weight: graph.edges[i]["weight"] })
                } this.setState({ graph: data });
                resolve();
            }).catch(() => { reject(); });
        });
    }

    /**
     * Make a force-directed graph of users
     * @see https://observablehq.com/@d3/force-directed-graph
     */
     renderGraph() {
        this.preRenderGraph();

        const chargeForce = d3.forceManyBody(this.state.graph.edges);
        chargeForce.strength(e => -2 * e.value);
        chargeForce.distanceMin(e => e.value);

        const sim = d3.forceSimulation(this.state.graph.nodes)
            .force("link", d3.forceLink(this.state.graph.edges).id(d => d.value))
            .force("charge", chargeForce)
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        // TODO: Normalize weights for opacity etc, add tooltip        
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

        const edge = this.svg.append("g")
            .attr("stroke", "#999")
            .selectAll("line")
            .data(this.state.graph.edges).join("line")
            .attr("stroke-width", d => Math.sqrt(d.weight / 2))
            .attr("stroke-opacity", d => Math.sqrt(d.weight));

        const node = this.svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(this.state.graph.nodes).join("circle")
            .attr("r", 5)
            .attr("fill", "#ee3333")
            .call(drag(sim));
            
        node.append("title")
            .text(d => d.value);

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