import React, { useState } from 'react';
import { TextField, Button, Container, List, ListItem, Grid } from '@mui/material';

import "./App.css";
import axios from 'axios';

function App(): JSX.Element {
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [pinballLocations, setPinballLocations] = useState(['']);
  const [err, setError] = useState('');

  const handleNearMeClick = () => {
    // Implement logic for Near Me button click
    // You can use the latitude and longitude state values
    // Check if the Geolocation API is available in the browser
    if (navigator.geolocation) {
      // Use navigator.geolocation.getCurrentPosition to get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(`${latitude}`);
          setLon(`${longitude}`);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleSearchClick = async () => {
    // Implement logic for Search button click
    // You can use the latitude and longitude state values
    // to fetch pinball locations and update the pinballLocations state

    try {
      const apiUrl = 'https://pinballmap.com/api/v1/location_machine_xrefs/most_recent_by_lat_lon';
      const response = await axios.get(`${apiUrl}?lat=${lat}&lon=${lon}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let dataRes: string[] = [];
      
      if(response.data.most_recently_added_machines){
        setPinballLocations([...response.data.most_recently_added_machines]);
      }
      else{
        dataRes = response.data.errors;
        setPinballLocations([response.data.errors + '  Please choose other coordinates.']);
      }
      
      console.log('wt2: ', dataRes);
    } catch (error) {
      console.error('wt11 Error:', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="header">
          Better Business Bureau
          <div className="Turborepo">Pinball Locations Finder</div>
        </h1>
        <div>
          {err}          
        </div>
        <div>
          <Container>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12}>
                <TextField
                  id="latitude"
                  label="Latitude"
                  placeholder="Enter Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  style={{ background: 'white' }}
                />
                <TextField
                  id="longitude"
                  label="Longitude"
                  placeholder="Enter Longitude"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  style={{ background: 'white' }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleNearMeClick}>
                  Near Me
                </Button>
                <Button variant="contained" color="primary" onClick={handleSearchClick}>
                  Search
                </Button>
              </Grid>
            </Grid>
            <List>
              {pinballLocations.map((location, index) => (
                <ListItem key={index}>{location}</ListItem>
              ))}
            </List>
          </Container>
        </div>
      </header>
    </div>
  );
}

export default App;
