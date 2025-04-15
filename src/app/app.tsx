import { createRoot } from 'react-dom/client';
import './app.css';
import './styles/layout-styles.css';
import './styles/text-styles.css';
import './styles/scrollbar-styles.css';
import './styles/global-styles.css';
import './styles/input-styles.css';
import Content from './content/content';

const root = createRoot(document.body);
root.render(
    <div>
        <Content></Content>
    </div>
);