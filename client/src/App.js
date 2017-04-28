import React, { Component } from 'react';
import MetadataReview from './components/MetadataReview';
import theme from './lib/theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Footer from './components/Footer';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'
          style={{
            backgroundColor: '#efefef',
            minWidth: 700,
            width: '100%',
            minHeight: '100vh',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
          <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
            <div style={{ minHeight: '100vh', flexDirection: 'column', display: 'flex' }}>
              <Route path="/" render={() => <main style={{ flex: '1 1 auto' }}>
                  <MetadataReview />
                </main>}
              />
              <Footer />
            </div>
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

export default App;
