import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import "./App.css";
import usePinballData from './hooks/usePinballData';
import type { PinballData } from './models/pinball';

function App(): JSX.Element {
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [pinballLocations, setPinballLocations] = useState<PinballData[] | undefined>([]);
  const [err, setErr] = useState('');
  const [firstClick, setFirstClick] = useState<boolean>(false);

  const { pinballMachines, loading, error } = usePinballData(lat, lon);

  const handleNearMeClick = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(`${latitude}`);
          setLon(`${longitude}`);
        },
        (gerr) => {
          setErr(gerr.message);
        }
      );
    } else {
      setErr('Geolocation is not supported by your browser.');
    }
  };

  const handleSearchClick = (): void => {
    try {
      setLat(lat);
      setLon(lon);
      setFirstClick(true);
      if (loading) {
        console.log('loading');
      } else {
        setPinballLocations(pinballMachines);
      }

    } catch (ce) {
      console.error('Error:', ce);
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
          <Container>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12}>
                <TextField
                  id="latitude"
                  label="Latitude"
                  placeholder="Enter Latitude"
                  value={lat}
                  onChange={(e): void => setLat(e.target.value)}
                  style={{ background: 'white' }}
                />
                <TextField
                  id="longitude"
                  label="Longitude"
                  placeholder="Enter Longitude"
                  value={lon}
                  onChange={(e): void => setLon(e.target.value)}
                  style={{ background: 'white' }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button variant="contained" color="primary" style={{marginRight: 40}} onClick={handleNearMeClick}>
                  Near Me
                </Button>
                <Button variant="contained" color="primary" onClick={handleSearchClick}>
                  Search
                </Button>
              </Grid>
            </Grid>
            <div>
              {error && firstClick &&(<>
                <Typography>{error?.message === 'No regions within 250 miles.' ? `${error?.message} ${err}` : ''}</Typography>
              </>)}
              {pinballLocations && pinballLocations?.length > 0 && !error && (
                <>                
                  <Typography variant="h5" gutterBottom>
                    Pinball Machines:
                  </Typography>
                  <Card>
                    <CardContent>
                      {pinballLocations?.map((machine: PinballData, index: number) => (
                        <div key={index}>
                          <Typography>{machine?.location?.name}</Typography>
                          <Typography>{machine?.location?.street}</Typography>
                          <Typography>{machine?.location?.city}, {machine?.location?.state} {machine?.location?.zip}</Typography>
                          <Typography variant="body1">
                            <a href={`https://www.google.com/maps?q=${machine?.location?.lat ?? ''},${machine?.location?.lon ?? ''}`} target="_blank" rel="noopener noreferrer">
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
