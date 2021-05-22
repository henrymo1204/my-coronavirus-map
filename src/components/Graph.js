import React, {Component} from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';

import {Bar, Line, Pie} from  'react-chartjs-2';
import axios from 'axios';

class Graph extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {
        await axios.get('https://corona.lmao.ninja/v2/countries')
        .then((res) => {
            var sortedData = [...res.data].sort((a, b) => b.cases - a.cases);
            var temp = sortedData.slice(0, 10).map(({country, cases}) => ({country, cases}));
            this.processData(temp);
        })
    };

    processData = (data) => {
        let label = [];
        let value = [];
        
        for (let d in data) {
            label.push(data[d]['country']);
            value.push(data[d]['cases']);
        }

        this.setState({data: {
            labels: label,
            datasets: [
                {
                    label: 'Cases',
                    data: value
                }
            ]
        }})
    };

    render() {
        const { data } = this.state;
        if (data === null) {
            return (
                <div></div>
            );
        };
        return (
            <div>
                <Bar data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        title:{
                            display:true,
                            text:'test',
                            fontSize:12
                        },
                    }} width='1000px' height='600px'>
                </Bar>
            </div>
        );
    }
}

export default Graph