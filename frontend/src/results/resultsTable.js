import React from 'react';
import { Table } from 'react-bootstrap';

export class ResultsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: this.props.heading,
            data: this.props.data
        };
    }

    renderRow(data, rownum, heading=false) {
        var render = [];
        for(var i = 0; i < data.length; i++) {
            if(heading) render.push(<th key={ "heading_" + i }>{ data[i] }</th>);
            else render.push(<td key={ "row_" + rownum + "_" + i }>{ data[i] }</td>);
        } return render;
    }

    renderData(data) {
        var rows = [];
        for(var i = 0; i < data.length; i++) {
            rows.push(<tr key={ "row_" + i }>{ this.renderRow(data[i], i) }</tr>);
        } return rows;
    }

    render() {
        // If we dont have data, dont render the table
        if(this.state.data.length === 0) {
            return (
                <h3>Nothing was found</h3>
            );
        }

        // Otherwise we have data, show it
        return (
            <Table responsive>
                <thead>
                    <tr key="heading">
                        { this.renderRow(this.state.heading, 0, true) }
                    </tr>
                </thead>
                <tbody>
                    { this.renderData(this.state.data) }
                </tbody>
            </Table>
        );
    }
}

