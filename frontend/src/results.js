import React from "react";
import { Redirect } from "react-router";
import { validate } from "./validate.js";
import { API } from "./api.js";

class Results extends React.Component {
  _mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.match.params.search,
      type: this.props.match.params.type,
    };
  }

  componentDidMount() {
    // TODO: Fetch results here from the backend
    // TODO: Currently simulating async using setTimeout
    this._mounted = true;

    API.searchMoviesByGenres(["Action", "Crime"]).then(console.log);

    setTimeout(() => {
      if (this._mounted) {
        console.log("hi");
        this.setState({ test: "hi" });
      }
    }, 3000);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    // First get if the state is valid
    if (!validate("search", this.state) || !validate("type", this.state)) {
      return <Redirect to="/" />;
    }

    // Wait for the backend to respond
    if (this.state.test === undefined) {
      return <h1>Loading from server...</h1>;
    }

    // Valid state, render the results
    return (
      <p>
        Type: {this.state.type} <br /> search: {this.state.search}
      </p>
    );
  }
}

export default Results;
