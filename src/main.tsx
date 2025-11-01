import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useProductStore } from './store/useProductStore'
import { NotificationService } from './services/notificationService'

// Initialize auth state
useProductStore.getState().init();

// Initialize notification service
const initNotifications = async () => {
  const granted = await NotificationService.requestPermission();
  if (granted) {
    console.log('Notification permissions granted');
  }
};

// Initialize notifications on app start
initNotifications();

createRoot(document.getElementById("root")!).render(<App />);
