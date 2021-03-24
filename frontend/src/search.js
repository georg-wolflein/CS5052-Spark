import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

/**
 * Search bar to allow people to search for things within the dataset.
 * Results are shown with custom components depending on the result.
 * @see README.md for more info on search modes.
 */
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            type: ""
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log(this.state);
    }

    render() {
        return (
            <Form inline>
                <Form.Row>
                    <Col xs="auto">
                        <Form.Label htmlFor="input" srOnly>
                            Input
                        </Form.Label>
                        <Form.Control className="mr-sm-2" 
                                    id="input" 
                                    placeholder="Toy Story"
                                    value={ this.state.search } 
                                    onChange={ (e) => { this.setState({ search: e.target.value }); } }/>
                    </Col>

                    <Col xs="auto">
                        <Form.Label htmlFor="type" srOnly>
                            Type
                        </Form.Label>
                        <Form.Control as="select"
                                    className="mr-sm-2"
                                    id="type"
                                    value={ this.state.type }
                                    onChange={ (e) => { this.setState({ type: e.target.value }); } }
                                    custom>
                            <option value="movie">Movie</option>
                            <option value="user">Users</option>
                            <option value="genre">Genres</option>
                        </Form.Control>
                    </Col>

                    <Col xs="auto">
                        <Button onClick={ this.handleClick }>
                            Submit
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        );
    }
}

export default SearchBar;