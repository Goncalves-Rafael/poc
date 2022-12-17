import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

import './App.css';
import BasicTabs from './components/BasicTabs';
import ItemsContainer from './components/ItemsContainer';
import AppContext from './utils/AppContext';
import { Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

const theme = createTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: purple[500],
    },
  },
});

function App() {
  const [state, setState] = React.useState({ generatedValues: [] });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AppContext.Provider value={[state, setState]}>
        <ThemeProvider theme={theme}>
          <Card sx={{ maxWidth: "90%", m: "auto", mt: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: green[700] }}>
                  <ShuffleIcon />
                </Avatar>
              }
              title="Gerador de Números da Sorte"
              titleTypographyProps={{variant: "h3"}}
            />
            <CardContent>
              <Box className="App"
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  p: 1,
                  m: 1,
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Paper>
                      <BasicTabs />
                    </Paper>
                  </Grid>
                  <Grid item xs={8}>
                    <Paper>
                      <ItemsContainer />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </ThemeProvider>
      </AppContext.Provider>
    </LocalizationProvider>
  );
}

export default App;