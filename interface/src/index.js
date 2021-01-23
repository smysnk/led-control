import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  // uri: '/api',
  cache: new InMemoryCache()
});


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[700],
    },
  },
});

ReactDOM.render(
  <>
    <ApolloProvider client={client}>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
