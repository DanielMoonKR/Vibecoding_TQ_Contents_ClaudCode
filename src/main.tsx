import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import { ToastProvider } from './components/ui/Toast';
import { GuidePage } from './pages/GuidePage';
import { IndexPage } from './pages/IndexPage';
import { BlocksPreview } from './pages/BlocksPreview';
import { MockAppPage } from './pages/MockAppPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ToastProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/guide/:contentId" element={<GuidePage />} />
          <Route path="/preview/blocks" element={<BlocksPreview />} />
          {/* 프로토타입 전용: 실제 앱 화면 자리 */}
          <Route path="/camp/:id" element={<MockAppPage kind="camp" />} />
          <Route path="/search" element={<MockAppPage kind="search" />} />
          <Route path="*" element={<IndexPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
