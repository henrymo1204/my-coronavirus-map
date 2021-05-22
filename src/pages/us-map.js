import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { useTrackerUS } from 'hooks';
import { commafy, friendlyDate } from 'lib/util';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 0,
  lng: -60
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;



const UsMap = () => {


  
  const { data: counties = {} } = useTrackerUS({
    api: 'counties'
  });
  console.log('CountyData',counties); 


  const hasCounties = Array.isArray(counties) && counties.length > 0;

  /*const dashboardStats = [
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
  ]*/

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
      features: counties.map((county = {}) => {
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
            ${ province }
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

        

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default UsMap;
