import { API } from './api.js'
import { BaseResult } from './baseResult.js';

/**
 * Users class which handles user API searches
 */
class UserResult extends BaseResult {
    async callAPI(search) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.okay = search;
                resolve();
            }, 2000);
        });
    }
    
    draw() {
        return (
            <h1>Hi {this.okay}</h1>
        );
    }
}

export default UserResult;