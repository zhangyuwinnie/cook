import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider, createNetworkInterface } from 'react-apollo';
import App from './js/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

const SERVER_HOST = process.env.BACKEND_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.BACKEND_SERVER_PORT || '4000';

const networkInterface = createNetworkInterface({
  uri: `http://${ SERVER_HOST }:${ SERVER_PORT }/graphql`,
  dataIdFromObject: o => o.id,
  opts: {
    credentials: 'same-origin',
  }
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id
    }
    return null
  }
});

const appStyle = {
    fontFamily: 'Roboto',
};

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <MuiThemeProvider>
                <div style={appStyle}>
                    <App/>
                </div>
            </MuiThemeProvider>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);
registerServiceWorker();