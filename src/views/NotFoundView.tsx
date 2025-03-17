import React from 'react';
import { Helmet } from 'react-helmet-async';

export const NotFoundView: React.FC = () => (
  <>
    <Helmet>
      <title>404 | OnRe</title>
    </Helmet>

    <div>404</div>
  </>
);
