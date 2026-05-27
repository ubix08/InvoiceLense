import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import DocsPage from './pages/DocsPage';

const AppPage = React.lazy(() => import('./pages/AppPage'));
const InvoiceLineItemsPage = React.lazy(() => import('./pages/InvoiceLineItemsPage'));
const BulkExpenseScannerPage = React.lazy(() => import('./pages/BulkExpenseScannerPage'));

interface LazyElementProps {
  children: React.ReactNode;
}

function LazyElement({ children }: LazyElementProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1e2333] border-t-[#f5a623] rounded-full animate-spin"></div>
        <p className="text-[#f5a623] font-mono uppercase tracking-widest text-sm animate-pulse">Loading InvoiceLens...</p>
      </div>
    }>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/app', element: <LazyElement><AppPage /></LazyElement> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/ocr-scanner/extract-invoice-line-items-to-csv', element: <LazyElement><InvoiceLineItemsPage /></LazyElement> },
  { path: '/receipt-parser/bulk-expense-scanner-for-accountants', element: <LazyElement><BulkExpenseScannerPage /></LazyElement> },
  { path: '/docs', element: <DocsPage /> },
]);
