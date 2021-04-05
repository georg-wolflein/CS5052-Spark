import React from 'react';
import * as d3 from "d3";

export class D3Base extends React.Component {
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
        this.svg = d3.select("#d3Base").append("svg").attr("width", "100%").attr("height", this.height);
        this.width = this.svg.node().getBoundingClientRect().width;
    }

    /**
     * Draw the graph using d3
     */
    renderGraph() {
        return;
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
                <div id="d3Base"></div>
                <br/>
            </div>
        );
    }
}

export default D3Base;