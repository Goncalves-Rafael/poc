import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import AppContext from '../utils/AppContext';
import TabularHashingConfig from './TabularHashingConfig';
import SeedHashingConfig from './SeedHashingConfig';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [appState, setAppState] = React.useContext(AppContext);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const setGeneratedValues = (values) => {
    setAppState(prevState => {
      return {
        ...prevState,
        generatedValues: values
      };
    });
  }

  const getInputItems = () => {
    return appState.inputItems || [];
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} >
          <Tab label="Tabular Hashing" {...a11yProps(0)} />
          <Tab label="Seed Hashing" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <TabularHashingConfig
          setGeneratedValues={setGeneratedValues}
          getInputItems={getInputItems}
        />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <SeedHashingConfig
          setGeneratedValues={setGeneratedValues}
          getInputItems={getInputItems}
        />
      </TabPanel>
    </Box>
  );
}