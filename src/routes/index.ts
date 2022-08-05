import React from 'react';
import lazy from './lazy';

const routes = [
  {
    path: '/',
    element: lazy(React.lazy(() => import(/* webpackChunkName: "page-Home" */ '../pages/home'))),
  },
  {
    path: '/demo',
    element: lazy(React.lazy(() => import(/* webpackChunkName: "page-Home" */ '../pages/demo'))),
  },
];

export default routes;
