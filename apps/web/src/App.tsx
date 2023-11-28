import React, { useState } from 'react';
import { TextField, Button, Container, List, ListItem, Grid, Card, CardContent, Typography } from '@mui/material';

import "./App.css";
import axios from 'axios';
import usePinballData from './hooks/usePinballData';
import { PinballData } from './models/pinball';

function App(): JSX.Element {
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [pinballLocations, setPinballLocations] = useState<PinballData[]>([]);
  const [err, setError] = useState('');

  const { pinballMachines, loading, error } = usePinballData(lat, lon);

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
      //const apiUrl = 'https://pinballmap.com/api/v1/location_machine_xrefs/most_recent_by_lat_lon';
      // const apiUrl = 'https://pinballmap.com/api/v1/locations/closest_by_lat_lon';
      // const response = await axios.get(`${apiUrl}?lat=${lat}&lon=${lon}`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // let dataRes: string[] = [];
      
      // if(response.data.most_recently_added_machines){
      //   setPinballLocations([...response.data.most_recently_added_machines]);
      // }
      // else{
      //   dataRes = response.data.errors;
      //   setPinballLocations([response.data.errors + '  Please choose other coordinates.']);
      // }
      
      // console.log('wt2: ', dataRes);
      setLat(lat);
      setLon(lon);
      if (loading) {
        // Handle loading state
        console.log('wt loading');
      // } else if (error) {
      //   console.log('data: ', pinballMachines);
      //   console.log('Error retrieving pinball data: ', error);
      } else {
        // Use closestRegion and pinballMachines data as needed 
        console.log('data: ', pinballMachines);       
        setPinballLocations([...pinballMachines]);
      }

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
            <div>
              {pinballLocations.length > 0 && (
                <>                
                  <Typography variant="h5" gutterBottom>
                    Pinball Machines:
                  </Typography>
                  <Card>
                    <CardContent>
                      {pinballLocations.map((machine: PinballData, index: number) => (
                        <div key={index}>
                          <Typography>Name: {machine?.location?.name}</Typography>
                          <Typography>Street: {machine?.location?.street}</Typography>
                          <Typography>City: {machine?.location?.city}</Typography>
                          <Typography>State: {machine?.location?.state}</Typography>
                          <Typography>Zip: {machine?.location?.zip}</Typography>
                          <Typography variant="body1">
                            <a href={`https://www.google.com/maps?q=${machine?.location?.lat},${machine?.location?.lon}`} target="_blank" rel="noopener noreferrer">
                              Open in Google Maps
                            </a>
                          </Typography>
                          <hr />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </Container>
        </div>
      </header>
    </div>
  );
}

export default App;
