import React, {Component} from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';

import {Bar, Line, Pie} from  'react-chartjs-2';
import axios from 'axios';
import { MapComponent } from 'react-leaflet';
import Moment from 'moment';

class Graph extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {
        await axios.get(this.props.url)
        .then((res1) => {
            if(this.props.url === 'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases') {
                var data1 = res1.data;
                axios.get('https://corona.lmao.ninja/v3/covid-19/countries?yesterday=true&sort=cases')
                .then((res2) => {
                    var data2 = res2.data;
                    var temp1 = data1.slice(0, 10).map(({country, cases, deaths, recovered}) => ({country, cases, deaths, recovered}));
                    var temp2 = data2.slice(0, 10).map(({country, cases, deaths, recovered}) => ({country, cases, deaths, recovered}));
                    var temp = []
                    temp.push(temp1);
                    temp.push(temp2);
                    this.processData(temp);
                })
            }
            else if (this.props.url === 'https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=14') {
                this.processData(res1.data);
            }
            else {
                var data = [];
                for (let i in res1.data) {
                    if (res1.data[i]['province'] === 'california') {
                        data.push(res1.data[i]);
                    }
                }
                var dateString = Date().toLocaleString();
                var date = new Moment(dateString).format('M/DD/YY').replace(/\b0/g, '');
                var sortedData = [...data].sort((a, b) => b.timeline.cases[date] - a.timeline.cases[date]);
                var temp = sortedData.slice(0, 10).map(({county, timeline}) => ({county, timeline}));
                this.processData(temp);
            }
        })
    };

    processData = (data) => {
        let label = [];
        let todayCases = [];
        let todayDeaths = [];
        let todayRecovered = [];
        let yesterdayCases = [];
        let yesterdayDeaths = [];
        let yesterdayRecovered = [];
        let cases = [];
        let deaths = [];
        let recovered = [];

        if (this.props.url === 'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases'){
            for (let d in data[0]) {
                label.push(data[0][d]['country']);
                todayCases.push(data[0][d]['cases']);
                todayDeaths.push(data[0][d]['deaths']);
                todayRecovered.push(data[0][d]['recovered']);
                yesterdayCases.push(data[1][d]['cases']);
                yesterdayDeaths.push(data[1][d]['deaths']);
                yesterdayRecovered.push(data[1][d]['recovered']);
            }
            this.setState({data: {
                labels: label,
                datasets: [
                    {
                        label: "Today's Cases",
                        data: todayCases
                    },
                    {
                        label: "Today's Recovered",
                        data: todayRecovered,
                        backgroundColor: 'rgba(155,231,91,0.2)'
                    },
                    {
                        label: "Today's Deaths",
                        data: todayDeaths,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                    },
                    {
                        label: "Yesterday's Cases",
                        data: yesterdayCases
                    },
                    {
                        label: "Today's Recovered",
                        data: yesterdayRecovered,
                        backgroundColor: 'rgba(155,231,91,0.2)'
                    },
                    {
                        label: "Today's Deaths",
                        data: yesterdayDeaths,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                    },
                ]
            }})
        }
        else if (this.props.url === 'https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=14') {
            var dateString = Date().toLocaleString();
            var date1 = new Moment(dateString).format('M/D/YY');
            for (var i = 13; i >= 0; i--) {
                var date = new Moment(dateString).subtract(i, 'day').format('M/DD/YY')
                date = date.replace(/\b0/g, '');
                label.push(date);
                cases.push(data['cases'][date]);
                deaths.push(data['deaths'][date]);
                recovered.push(data['recovered'][date]);
            }
            this.setState({data: {
                labels: label,
                datasets: [
                    {
                        label: "Cases",
                        data: cases
                    },
                    {
                        label: "Recovered",
                        data: recovered,
                        backgroundColor: 'rgba(155,231,91,0.2)'
                    },
                    {
                        label: "Deaths",
                        data: deaths,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                    }
                ]
            }})
        }
        else {
            var dateString = Date().toLocaleString();
            var date1 = new Moment(dateString).format('M/D/YY').replace(/\b0/g, '');
            var date2 = new Moment(dateString).subtract(1, 'day').format('M/D/YY').replace(/\b0/g, '');
            for (let d in data) {
                label.push(data[d]['county']);
                todayCases.push(data[d]['timeline']['cases'][date1]);
                todayDeaths.push(data[d]['timeline']['deaths'][date1]);
                yesterdayCases.push(data[d]['timeline']['cases'][date2]);
                yesterdayDeaths.push(data[d]['timeline']['deaths'][date2]);
            }
            this.setState({data: {
                labels: label,
                datasets: [
                    {
                        label: "Today's Cases",
                        data: todayCases
                    },
                    {
                        label: "Today's Recovered",
                        data: todayRecovered,
                        backgroundColor: 'rgba(155,231,91,0.2)'
                    },
                    {
                        label: "Today's Deaths",
                        data: todayDeaths,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                    },
                    {
                        label: "Yesterday's Cases",
                        data: yesterdayCases
                    },
                    {
                        label: "Yesteroday's Recovered",
                        data: yesterdayRecovered,
                        backgroundColor: 'rgba(155,231,91,0.2)'
                    },
                    {
                        label: "Yesterday's Deaths",
                        data: yesterdayDeaths,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                    },
                ]
            }})
        }
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
                        display: true
                    }} width='1000px' height='600px'>
                </Bar>
            </div>
        );
    }
}

export default Graph