import React from 'react';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: this.props.match.params.search,
            type: this.props.match.params.type
        };
    }

    render() {
        return (
            <p>hi {this.state.type} & {this.state.search}</p>
        );
    }
}

export default Results;