import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { useTrackerUS } from 'hooks';
import { useTrackerCali} from 'hooks';

import { commafy, friendlyDate } from 'lib/util';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import Graph from 'components/Graph';
import ProjectedGraph from '../components/ProjectedGraph';
import PredictGraph from '../components/PredictGraph';

const LOCATION = {
  lat: 35,
  lng: -120
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 6;
var stateStorage = [];


const UsMap = () => {

  var count =0;
  var i;

  const { data: counties = {} } = useTrackerUS({
    api: 'counties'
  });

  const { data: california = {} } = useTrackerCali({
    api: 'california'
  });

  for (i in counties) {
    if (counties.hasOwnProperty(i)) 
    {
      count++;
    }
  }

  for (let i =0; i <count; i++) {
    if (counties[i].province==='California' && counties[i].county !== "Unassigned")
    {
        stateStorage.push(counties[i]); 
    }
  }
  console.log('CountyData',counties); 
  console.log('CaliData',stateStorage); 
  console.log('CaliTotals',california); 


  const hasCounties = Array.isArray(stateStorage) && stateStorage.length > 0;

  const dashboardStats = [
    {
      primary: {
        label: 'Total Cases',
        value: california ? commafy(california?.cases) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: california ? commafy(california?.casesPerOneMillion) : '-'
      }
    },
    {
      primary: {
        label: 'Total Deaths',
        value: california ? commafy(california?.deaths) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: california ? commafy(california?.deathsPerOneMillion) : '-'
      }
    },
    {
      primary: {
        label: 'Total Tests',
        value: california ? commafy(california?.tests) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: california? commafy(california?.testsPerOneMillion) : '-'
      }
    },

    {
      primary: {
        label: 'Active Cases',
        value: california ? commafy(california?.active) : '-'
      },

      secondary: {
        label: 'Population',
        value: california ? commafy(california?.population) : '-'
      }
    },
    {
      primary: {
        label: 'Cases Today',
        value: california ? commafy(california?.todayCases) : '-'
      },
      secondary: {
        label: 'Deaths Today',
        value: california?.todayDeaths
      }
    },
    {
      primary: {
        label: 'Recovered Cases',
        value: california ? commafy(california?.recovered) : '-'
      }
    }
  ]

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    
    if ( !hasCounties || !map ) return;

    map.eachLayer(layer => {
      if ( layer?.options?.name === 'OpenStreetMap' ) return;
      map.removeLayer(layer);
    });

    const geoJson = {
      type: 'FeatureCollection',
      features: stateStorage.map((county = {}) => {
        const { coordinates = {} } = county;
        const { latitude, longitude } = coordinates;
        return {
          type: 'Feature',
          properties: {
            ...county,
          },
          geometry: {
            type: 'Point',
            coordinates: [ longitude, latitude ]
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
          province,
          updatedAt,
          county,
          country,
          stats
        } = properties

        if ( county > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( updatedAt ) {
          updatedFormatted = new Date(updatedAt).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${county}</h2>
              <ul>
                <li><strong>State:</strong> ${province}</li>
                <li><strong>Confirmed:</strong> ${stats.confirmed}</li>
                <li><strong>Deaths:</strong> ${stats.deaths}</li>
                <li><strong>Recovered:</strong> ${stats.recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ county }
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
              Last Updated: { california ? friendlyDate(california?.updated) : '-' }
            </p>
          </div>
        </div>
      </div>
      <div>Total Cases, Recovered, Deaths By California County</div>
      <Graph url={'https://corona.lmao.ninja/v3/covid-19/historical/usacounties/california?lastdays=2'}></Graph>
      <div>Projected Actual Total Cases, Recovered, Deaths By California County</div>
      <ProjectedGraph url={'https://corona.lmao.ninja/v3/covid-19/jhucsse/counties'}></ProjectedGraph>
      <div>Prediction of Actual Total Cases, Recovered, Deaths By California County</div>
      <PredictGraph url={'https://corona.lmao.ninja/v3/covid-19/jhucsse/counties'}></PredictGraph>
    </Layout>
  );
};

export default UsMap;
