import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';

import {ReactVirtualizedTable_byCountry, ReactVirtualizedTable_byStates, 
  ReactVirtualizedTable_byCounty }from 'components/reacttable'

const SecondPage = () => {

  return (
    <Layout pageName="two">
      <Helmet>
        <title>Page Two</title>
      </Helmet>
      <Container type="content" className="text-center">
      <div className = 'App'>     
            <h1>Covid-19 Cases All Over The World</h1>
            <ReactVirtualizedTable_byCountry/>
            <h1>Covid-19 Cases in US</h1>
            <ReactVirtualizedTable_byStates/>
            <h1>Covid-19 Cases in California</h1>
            <ReactVirtualizedTable_byCounty/>
        </div>
      </Container>
    </Layout>
  );
};
export default SecondPage;

