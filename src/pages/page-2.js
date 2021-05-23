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
            <h1>Country</h1>
            <ReactVirtualizedTable_byCountry/>
            <h1>States</h1>
            <ReactVirtualizedTable_byStates/>
            <h1>County</h1>
            <ReactVirtualizedTable_byCounty/>
        </div>
      </Container>
    </Layout>
  );
};
export default SecondPage;

