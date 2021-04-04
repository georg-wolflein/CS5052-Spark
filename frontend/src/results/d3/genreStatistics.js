import { API } from '../api.js'
import { D3BarChart } from './d3BarChart.js';

class GenreStatistics extends D3BarChart {
    constructor(props) {
        super(props);
        this.state = {
            title: "Genre Statistics",
            query: this.state.query
        }
    }
    
    callAPI() {
        return new Promise((resolve, reject) => {
            API.getGenresByUser(this.state.query).then((genres) => {
                // Need to transform the data into a nice array to work with
                var data = [];
                for(var i = 0; i < Object.keys(genres).length; i++) {
                    var key = Object.keys(genres)[i];
                    var value = genres[key];
                    data.push({ key: key, value: value });
                } this.setState({ data: data });
                resolve();
            });
        });
    }
}

export default GenreStatistics;