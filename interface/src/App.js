import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, Grid, Box } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import update from 'immutability-helper';
import { useQuery, useMutation, gql } from '@apollo/client';


import TextField from '@material-ui/core/TextField';

import LogoMqtt from './logo-mqtt';
import LogoNeopixel from './logo-neopixel';

const color = 'C90A6D';

const useStyles = makeStyles({
  mqttConfigContainer: {
    padding: '10px',
  },
  mqttConfig: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    '& > *': {
      // backgroundColor: 'red',
      margin: '0px 5px',
    }
  },
  logo: {
    height: '8vmin',
  },
  logoColor: {
    fill: '#C90A6D',
  },
  config: {
    marginTop: '22px',
    width: '100%',
  },
  test: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    '& > *': {
      // backgroundColor: 'red',
      margin: '0px 5px',
    }
  },
  code: {    
    '& textarea': {
      // backgroundColor: 'red',
      fontFamily: [
        'Monospace',
      ].join(','),
    }
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
  json: {
    whiteSpace: 'pre',
  }
});

const useStylesLogos = makeStyles(theme => createStyles({
  st1: {
    fill: theme.palette.secondary.main,
  },
  st2: {
    fill: '#C90A6D',
  },
  st3: {
    fill: '#023862',
  },
}));

const QUERY_MQTT_CONFIG = gql`
  query GetMqttConfig {
    mqttConfig {
      name
      schema
      state_topic
      command_topic
      brightness
      brightness_scale
      hs
      rgb
    }
  }`;

  const SET_MQTT_CONFIG = gql`
  mutation SetMqttConfig($input: MqttConfig!) {
    setMqttConfig(input: $input) {
      error
      message
    }
  }`;

function App() {
  const classes = useStyles();
  const classesLogo = useStylesLogos();
  const [config, setConfig] = useState({
    prefix: 'homeassistant'
  });

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setConfig(o => update(o, {
      [name]: { $set: value },
    }));
  }, []);

  const template = {
    "name": "abc",
    "schema": "json",
    "state_topic": `${config.prefix}/light/abc/state`,
    "command_topic": `${config.prefix}/light/abc/set`,
    "brightness": true,
    "brightness_scale": 4095,
    "hs": true,
    "rgb": true
  };

  const { loading, error, data } = useQuery(QUERY_MQTT_CONFIG);
  const [updateMqttConfig] = useMutation(SET_MQTT_CONFIG);

  const onSubmit = useCallback(async (e) => {
    const { data } = await updateMqttConfig({ variables: { input: template } });
  }, [updateMqttConfig, config]);



  return (
    <div>
      <Container maxWidth="md">
        <Box p={2} mb={1} >  
          <Grid container spacing={3} justify="center">
            <LogoMqtt parent={ classes.logo } { ...classesLogo } />
            <LogoNeopixel parent={ classes.logo } { ...classesLogo } />
          </Grid>
        </Box>
        <Box p={2} borderRadius={16} border={1} mb={1} boxShadow={6} 
          bgcolor="secondary.main"
          color="black"
          className={ classes.json }    
        >  
        { JSON.stringify(data?.mqttConfig, null, 2) }
        </Box>

        <Box p={3}>      
          <Grid container spacing={1}>
{/*             
            
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                <Grid container item spacing={3} alignItems="center">    
                  <Grid item><Typography variant="h5">Prefix</Typography></Grid>
                  <Grid item><TextField label="" color="secondary" variant="outlined" name="prefix" fullWidth value={config.prefix} onChange={onChange}  /></Grid>
                  <Grid item><CheckCircleOutlineIcon fontSize="large"/></Grid>
                </Grid>
                </Paper>  
              </Grid> */}



              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" bgcolor="background.paper" alignItems="center">
                  <Box p={1}>
                    <Typography variant="h5">Prefix</Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <TextField label="" color="secondary" variant="outlined" name="prefix" value={config.prefix} onChange={onChange} fullWidth />
                  </Box>
                  <Box p={1}>
                  <CheckCircleOutlineIcon fontSize="large"/>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" bgcolor="background.paper" alignItems="center">
                  <Box p={1} width={100}>
                    <Typography variant="h5">Prefix</Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <TextField label="" color="secondary" variant="outlined" name="prefix" value={config.prefix} onChange={onChange} fullWidth />
                  </Box>
                  <Box p={1}>
                  <CheckCircleOutlineIcon fontSize="large"/>
                  </Box>
                </Box>
              </Grid>
            
            <Grid container item xs={12} spacing={3}></Grid>
            <Grid container item xs={12} spacing={3}></Grid>
          </Grid>        
        </Box>

        <Box p={3}>  
         <Button color="secondary" variant="contained" size="large" onClick={onSubmit}>Configure</Button>
        </Box>

      </Container>
    </div>
  );
}

export default App;
