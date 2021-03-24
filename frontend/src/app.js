import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import SearchBar from './search.js'
import React from 'react';
import Main from './main.js'

/**
 * Component for holding the main layout of the application.
 * TODO: Do we need <Links> in here? `import { Link } from "react-router-dom";`
 */
class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">Spark</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/visualisations">Visualisations</Nav.Link>
                    </Nav>
                    <SearchBar />
                </Navbar>

                <Container className="mt-2">
                    <Main />
                </Container>
            </div>
        );
    }
}

export default App;
