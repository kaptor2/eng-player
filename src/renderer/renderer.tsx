import { createRoot } from 'react-dom/client';
import { App } from './app';

const root = document.getElementById('app')!;
createRoot(root).render(<App />);