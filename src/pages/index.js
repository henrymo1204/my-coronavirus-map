import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { useTracker } from 'hooks';
import { commafy, friendlyDate } from 'lib/util';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import Graph from 'components/Graph';
import ProjectedGraph from 'components/ProjectedGraph';
import PredictGraph from 'components/PredictGraph';

const LOCATION = {
  lat: -45,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1.5;



const IndexPage = () => {

  const { data: countries = [] } = useTracker({
    api: 'countries'
  });

  const { data: stats = {} } = useTracker({
    api: 'all'
  });



  
  console.log('stats',stats); 
  console.log('Data',countries); 

  const hasCountries = Array.isArray(countries) && countries.length > 0;

  const dashboardStats = [
    {
      primary: {
        label: 'Total Cases',
        value: stats ? commafy(stats?.cases) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats ?.casesPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Deaths',
        value: stats ? commafy(stats?.deaths) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats ?.deathsPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Tests',
        value: stats ? commafy(stats?.tests) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.testsPerOneMillion
      }
    },

    {
      primary: {
        label: 'Active Cases',
        value: stats ? commafy(stats?.active) : '-'
      }
    },
    {
      primary: {
        label: 'Critical Cases',
        value: stats ? commafy(stats?.critical) : '-'
      }
    },
    {
      primary: {
        label: 'Recovered Cases',
        value: stats ? commafy(stats?.recovered) : '-'
      }
    }
  ]

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    
    if ( !hasCountries || !map ) return;

    map.eachLayer(layer => {
      if ( layer?.options?.name === 'OpenStreetMap' ) return;
      map.removeLayer(layer);
    });

    const geoJson = {
      type: 'FeatureCollection',
      features: countries.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties

        casesString = `${cases}`;

        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo(map)
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
        
      <Map {...mapSettings} />
      <div className="tracker">
        <div className="tracker-stats">
          <ul>
            { dashboardStats.map(({ primary = {}, secondary = {} }, i) => {
              return (
                <li key={`Stat-${i}`} className="tracker-stat">
                  { primary.value && (
                    <p className="tracker-stat-primary">
                      { primary.value }
                      <strong>{ primary.label }</strong>
                    </p>
                  )}
                  { secondary.value && (
                    <p className="tracker-stat-secondary">
                      { secondary.value }
                      <strong>{ secondary.label }</strong>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="tracker-last-updated">
            <p>
              Last Updated: { stats ? friendlyDate(stats?.updated) : '-' }
            </p>
          </div>
        </div>
      </div>
      <div>Total Cases, Decovered, Deaths By Country</div>
      <Graph url={'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases'}></Graph>
      <div>Total Cases, Decovered, Deaths Worldwide In The Past 14 Days</div>
      <Graph url={'https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=14'}></Graph>
      <div>Projected Actual Total Cases, Decovered, Deaths By Country</div>
      <ProjectedGraph url={'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases'}></ProjectedGraph>
      <div>Prediction of Actual Total Cases, Decovered, Deaths By Country</div>
      <PredictGraph url={'https://corona.lmao.ninja/v3/covid-19/countries?sort=cases'}></PredictGraph>
    </Layout>
  );
};

export default IndexPage;
