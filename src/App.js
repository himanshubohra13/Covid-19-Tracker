import react, { useEffect, useState } from 'react';
import {
  MenuItem,
  FormControl,
  Select, Card, CardContent
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import { sortData } from './util';
import Table from './Table';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });

    }
    getCountriesData();

  }, [])// load once app load.

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
        setMapCenter({
          lat: data.countryInfo.lat,
          lng: data.countryInfo.long
        });

      })
    console.log(countryInfo);
  }
  return (
    <div className="app">
      <div className='app__left'>
        <div className="app__header">


          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={onCountryChange}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map(country => {
                return <MenuItem value={country.value}>{country.name}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <InfoBox isRed onClick={(e) => setCasesType('cases')} active={casesType === 'cases'}
            title="Coronavirus Cases" total={countryInfo.cases} cases={prettyPrintStat(countryInfo.todayCases)}></InfoBox>
          <InfoBox active={casesType === 'recovered'} onClick={(e) => setCasesType('recovered')} title="Recovered" total={countryInfo.recovered} cases={prettyPrintStat(countryInfo.todayRecovered)}></InfoBox>
          <InfoBox isRed active={casesType === 'deaths'} onClick={(e) => setCasesType('deaths')} title="Deaths" total={countryInfo.deaths} cases={prettyPrintStat(countryInfo.todayDeaths)}></InfoBox>
        </div>

        <Map
          casesType={casesType}
          center={mapCenter}
          countries={mapCountries}
          zoom={mapZoom} />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new cases</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
        {/* Table */}

        {/* Graph */}
      </Card>



      {/* Map */}
    </div>
  );
}

export default App;
