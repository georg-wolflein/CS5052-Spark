import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Route } from 'react-router-dom'

/**
 * Search bar to allow people to search for things within the dataset.
 * Results are shown with custom components depending on the result.
 * @see README.md for more info on search modes.
 */
class SearchBar extends React.Component {
    getURL() {
        return "/search/" + this.props.type + "/" + this.props.search;
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
                                    id="search" 
                                    placeholder="Toy Story"
                                    value={ this.props.search } 
                                    onChange={ (e) => { this.props.onChange(e); } }/>
                    </Col>

                    <Col xs="auto">
                        <Form.Label htmlFor="type" srOnly>
                            Type
                        </Form.Label>
                        <Form.Control as="select"
                                    className="mr-sm-2"
                                    id="type"
                                    value={ this.props.type }
                                    onChange={ (e) => { this.props.onChange(e); } }
                                    custom>
                            <option value="movie">Movie</option>
                            <option value="user">Users</option>
                            <option value="genre">Genres</option>
                        </Form.Control>
                    </Col>

                    <Col xs="auto">
                        <Route render={ ({ history }) => (
                            <Button onClick={ () => { history.push(this.getURL()) } }>
                                Submit
                            </Button>
                        )} />
                    </Col>
                </Form.Row>
            </Form>
        );
    }
}

export default SearchBar;