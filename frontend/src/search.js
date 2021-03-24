import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Route } from 'react-router-dom'
import { validate } from './validate.js'

/**
 * Search bar to allow people to search for things within the dataset.
 * Results are shown with custom components depending on the result.
 * @see README.md for more info on search modes.
 */
class SearchBar extends React.Component {
    /**
     * Get the placeholder text for the query box
     * @returns the placeholder text for the query box
     */
    getPlaceholder() {
        if (this.props.type === "movie") return "Toy Story";
        else if(this.props.type === "user") return "1, 2";
        else if(this.props.type === "genre") return "Action";
        return "";
    }

    /**
     * Get the URL to go to
     * @returns the URL to redirect to
     */
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
                        <Form.Control isInvalid={ !validate("search", this.props.search) }
                                    className="mr-sm-2" 
                                    id="search" 
                                    placeholder={ this.getPlaceholder() }
                                    value={ this.props.search } 
                                    onChange={ (e) => { this.props.onChange(e); } }/>
                    </Col>

                    <Col xs="auto">
                        <Form.Label htmlFor="type" srOnly>
                            Type
                        </Form.Label>
                        <Form.Control isInvalid={ !validate("type", this.props.type) }
                                    as="select"
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
                            <Button onClick={ () => { 
                                if(validate("type", this.props.type) && validate("search", this.props.search)) {
                                    if(this.props.search !== "") history.push(this.getURL());
                                } } }>
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