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
                console.log(graph);
                this.setState({ graph: graph });
                resolve();
            }).catch(() => { reject(); });
        });
    }

    /**
     * Make a force-directed graph of users
     */
     renderGraph() {
        this.preRenderGraph();

        
    }
}

export default ClusterUsers;