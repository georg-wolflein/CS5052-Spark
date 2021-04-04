import { API } from '../api.js'
import { D3BarChart } from './d3BarChart.js';
import * as d3 from "d3";

class CompareUsers extends D3BarChart {
    constructor(props) {
        super(props);
        this.state = {
            title: "Compare Users " + this.state.query[0] + " & " + this.state.query[1],
            query: this.state.query
        }
    }

    callAPI() {
        return new Promise((resolve, reject) => {
            API.compareMovieTastes(this.state.query[0], this.state.query[1]).then((percents) => {
                console.log(percents);

                // Need to transform the data into a nice array to work with
                var data = [];
                for(var i = 0; i < percents.length; i++) {
                    var key = percents[i].genre;
                    var value1 = percents["percentage_user1"];
                    var value2 = percents["percentage_user2"]
                    data.push({ key: key, value1: value1, value2: value2 });
                } this.setState({ data: data });
                resolve();
            });
        });
    }

    renderGraph() {
        this.preRenderGraph();
    }
}

export default CompareUsers;