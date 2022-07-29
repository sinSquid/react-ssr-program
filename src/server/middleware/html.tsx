import React from 'react';
import serialize from 'serialize-javascript';

const html = ({ assets: { js, css, link }, markup, appState, helmet }) => {
  console.log(helmet, helmet.htmlAttributes.toComponent());
  const { lang, title, ...rest } = { ...helmet.htmlAttributes.toComponent() };
  return (
    <html lang={lang}>
      <head title={title}>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
        <title>{helmet.title.toComponent()}</title>
        {helmet.noscript.toComponent()}
        {helmet.base.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.style.toComponent()}
        {helmet.script.toComponent()}
        {link}
        {css}
      </head>
      <body {...rest}>
        <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
        <script
          id="appState"
          dangerouslySetInnerHTML={{
            __html: `window.APP_INITIAL_STATE=${serialize(appState, {
              isJSON: true,
            })}`,
          }}
        />
        {js}
      </body>
    </html>
  );
};

export default html;
