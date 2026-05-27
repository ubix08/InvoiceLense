import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { PwaInstallPrompt } from './components/layout/PwaInstallPrompt';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <PwaInstallPrompt />
  </StrictMode>,
);
