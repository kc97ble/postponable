import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

function App() {
  return <Router>
    <Route path='/view' component={ViewPage}/>
  </Router>;
}

export default App;
