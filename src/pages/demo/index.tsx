import React from 'react';

function Demo() {
  return <div>demo</div>;
}

Demo.fetchData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });
};

export default Demo;
