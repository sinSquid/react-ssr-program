import React, { Suspense } from 'react';

const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Comp />
    </Suspense>
  );
};

export default lazyLoad;
