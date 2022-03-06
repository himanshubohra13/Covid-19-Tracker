import { Circle, Popup } from 'react-leaflet';
import React from 'react';
import numeral from 'numeral';
const casesTypeColors = {
    cases: {
        hex: "#CC1034",

        multiplier: 150,
    },
    recovered: {
        hex: "#7dd71d",

        multiplier: 170,
    },
    deaths: {
        hex: "#fb4443",

        multiplier: 1200,
    },
};
export const sortData = (data) => {
    const sortData = [...data];

    sortData.sort((a, b) => b.cases - a.cases);
    return sortData;
};
export const showDataOnMap = (data, casesType = 'cases') => (

    data.map(country =>
    (<Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
            Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
    >
        <Popup>
            <div className='info-container'>
                <div
                    className='info-flag'
                    style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0.0a")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0.0a")}</div>
                <div className="info-deaths">Deaths: {numeral(country.recovered).format("0.0a")}</div>
            </div>
        </Popup>
    </Circle >
    )
    )
)
export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : `+0`