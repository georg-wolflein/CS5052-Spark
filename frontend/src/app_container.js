import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import SearchBar from './search.js'

/**
 * Component for holding the main layout of the application.
 */
function AppContainer() {
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Spark</Navbar.Brand>
                <SearchBar />
            </Navbar>

            <Container className="mt-2">
                hii!!
            </Container>
        </div>
    );
}

export default AppContainer;
