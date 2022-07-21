import React from 'react';
import PT from 'prop-types';
import { Helmet } from 'react-helmet-async';

function App({ children }) {
  return (
    <div>
      <Helmet defaultTitle="default" />
      {children}
    </div>
  );
}

App.defaultProps = {
  children: <span>hello</span>,
};

App.propTypes = {
  children: PT.node,
};

export default App;
