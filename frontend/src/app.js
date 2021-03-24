import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import SearchBar from './search.js'
import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Results from './results.js';
import Visualisations from './visualisations.js';

/**
 * Component for holding the main layout of the application.
 * TODO: Do we need <Links> in here? `import { Link } from "react-router-dom";`
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            search: "",
            type: "movie"
        };
    }

    handleChange(e) {
        const name = e.target.id;
        this.setState({ [name] : e.target.value });
    }

    render() {
        return (
            <Router>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">Spark</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/visualisations">Visualisations</Nav.Link>
                    </Nav>
                    <SearchBar search={ this.state.search }
                        type={ this.state.type }
                        onChange={ this.handleChange } />
                </Navbar>

                <Container className="mt-2">
                    <Switch>
                        <Route exact path="/" render={ () => (
                            <div className="home">
                                <h1>Spark Practical</h1>
                                <p>Enter a search query, or <Link to="/visualisations">explore visualisations</Link>!</p>
                            </div>
                        )}/>
                        <Route path="/search/:type/:search" component={ Results } />
                        <Route path='/visualisations' component={ Visualisations } />
                        <Route path="*" render={ () => (
                            <div className="home">
                                <h1>404</h1>
                                <p>Please return <Link to="/">Home</Link>.</p>
                            </div>
                        )}/>

                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
