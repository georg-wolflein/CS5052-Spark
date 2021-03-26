import React from 'react';
import { BaseResult, resultDisplayer } from './baseResult.js';

/**
 * Users class which handles user API searches
 */
class Users extends BaseResult {
    async callAPI(search) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.okay = search;
                resolve();
            }, 2000);
        });
    }
    
    render() {
        return (
            <h1>Hi {this.okay}</h1>
        );
    }
}

// Export the component using the results displayer function
const UserResult = resultDisplayer(new Users());

export default UserResult;