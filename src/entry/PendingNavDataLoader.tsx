import React, { useEffect, useRef, useState, ReactNode, Component } from 'react';
import NProgress from 'nprogress';
import qs from 'query-string';
import { Route } from 'react-router';
import { Location } from 'history';
import { Store } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import 'nprogress/nprogress.css';
import fetchDataBeforeRender from '~@/utils/fetchDataBeforeRender';

interface navProp {
  location: Location;
  routes: { path: string; component: Component }[];
  store: Store;
  children: ReactNode;
}

function PendingNavDataLoader({ location, routes, store, children }: navProp) {
  const locationRef = useRef(location);
  useEffect(() => {
    const navigate = locationRef.current !== location;
    if (navigate) {
      fetchDataBeforeRender({
        store,
        routes,
        query: qs.parse(location.search),
        url: location.pathname,
        onProgress: ({ progress }) => {
          NProgress.set(progress);
        },
      })
        .then(() => {
          // TODO added on 2022/7/19 16:58
        })
        .catch(() => {});
    }
  }, [location]);
  return <Route path={location.pathname} element={children} />;
}

function withRouter(CustomizeComponent) {
  function ComponentWithRouterProp(props) {
    const [location, navigate, params] = [useLocation(), useNavigate(), useParams()];
    return <CustomizeComponent {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter(PendingNavDataLoader);
