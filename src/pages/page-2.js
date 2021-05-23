import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Graph from 'components/Graph';

import {Bar, Line, Pie} from  'react-chartjs-2';
import axios from 'axios';


const SecondPage = () => {

  return (
    <Layout pageName="two">
      <Helmet>
        <title>Page Two</title>
      </Helmet>
      <Container type="content" className="text-center">
        <Graph>{'test'}</Graph>
      </Container>
    </Layout>
  );
};
export default SecondPage;

