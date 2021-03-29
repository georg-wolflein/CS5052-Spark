import React from 'react';

export class CompareUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.props.users,
        };
    }

    render() {
        // TODO: This comparison
        return (
            <p>This needs to be implemented with d3.js</p>
        );
    }
}

