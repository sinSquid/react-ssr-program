import loadable from '@loadable/component';

const routes = [
  {
    path: '/',
    exact: true,
    component: loadable(() => import(/* webpackChunkName: "page-Home" */ '../pages/home')),
  },
  {
    path: '/demo',
    component: loadable(() => import(/* webpackChunkName: "page-Demo" */ '../pages/demo')),
  },
];

export default routes;
