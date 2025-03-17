import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Application } from './Application.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
