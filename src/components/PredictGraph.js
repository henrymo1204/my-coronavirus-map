import React, {Component} from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';

import {Bar, Line, Pie} from  'react-chartjs-2';
import axios from 'axios';
import { MapComponent } from 'react-leaflet';
import Moment from 'moment';

class PredictGraph extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {
        await axios.get(this.props.url)
        .then((res) => {
            if (this.props.url === 'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases') {
                var data = res.data
                var temp1 = data.slice(0, 10).map(({country, cases, deaths, recovered}) => ({country, cases, deaths, recovered}));
                this.processData(temp1);
            }
            else {
                var data = [];
                for (let i in res.data) {
                    if (res.data[i]['province'] === 'California') {
                        data.push(res.data[i]);
                    }
                }
                var sortedData = [...data].sort((a, b) => b.stats.confirmed - a.stats.confirmed);
                var temp = sortedData.slice(0, 10).map(({county, stats}) => ({county, stats}));
                this.processData(temp);
            }
        })
    };

    processData = (data) => {
        let label = [];
        let cases = [];
        let deaths = [];
        let recovered = [];

        for (let d in data) {
            if (this.props.url === 'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases') {
                label.push(data[d]['country']);
                cases.push(data[d]['cases'] * 10);
                deaths.push(data[d]['deaths'] * 10);
                recovered.push(data[d]['recovered'] * 10);
            }
            else {
                label.push(data[d]['county']);
                cases.push(data[d]['stats']['confirmed'] * 10);
                deaths.push(data[d]['stats']['deaths'] * 10);
                recovered.push(data[d]['stats']['recovered'] * 10);
            }
        }

        this.setState({data: {
            labels: label,
            datasets: [
                {
                    label: "Predict Cases",
                    data: cases
                },
                {
                    label: "Predict Recovered",
                    data: recovered,
                    backgroundColor: 'rgba(155,231,91,0.2)'
                },
                {
                    label: "Predict Deaths",
                    data: deaths,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                },
            ]
        }})
    }

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
                        display: true
                    }} width='1000px' height='600px'>
                </Bar>
            </div>
        );
    }
}

export default PredictGraph