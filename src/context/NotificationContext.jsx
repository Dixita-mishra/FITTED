import React, { createContext, useContext, useState, useEffect } from 'react';
import { getClimateClothesRecommendation } from '../services/weatherService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_01',
      type: 'system',
      title: 'Wardrobe Gap Synergy',
      message: 'Added 44 new studio-curated items to your Digital Vault for effortless daily mixing.',
      timestamp: '1h ago',
      unread: false
    }
  ]);

  const [activeToast, setActiveToast] = useState(null);

  // Ask for Web Notification permission in browser if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Can request when user interacts
      }
    }
  }, []);

  const sendWeatherNotification = (weatherData, wardrobeItems = []) => {
    if (!weatherData) return null;

    const climateRec = getClimateClothesRecommendation(weatherData, wardrobeItems);

    const newNotification = {
      id: `notif_weather_${Date.now()}`,
      type: 'weather_outfit',
      title: `Climate Alert: ${climateRec.condition} (${climateRec.temperature}°C in ${climateRec.city})`,
      message: climateRec.advice,
      pieceNames: climateRec.pieceNames,
      pieces: climateRec.pieces,
      temperature: climateRec.temperature,
      condition: climateRec.condition,
      city: climateRec.city,
      timestamp: 'Just now',
      unread: true,
      createdDate: new Date()
    };

    // Prepend to notifications list
    setNotifications(prev => [newNotification, ...prev]);

    // Show floating in-app toast
    setActiveToast(newNotification);

    // Auto-dismiss toast after 7 seconds
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotification.id ? null : current);
    }, 7000);

    // Trigger native browser notification if available
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`Fitted — ${climateRec.temperature}°C ${climateRec.condition}`, {
            body: `Recommended: ${climateRec.pieceNames}. ${climateRec.advice}`,
            icon: climateRec.pieces?.[0]?.image || '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(`Fitted — ${climateRec.temperature}°C ${climateRec.condition}`, {
                body: `Recommended: ${climateRec.pieceNames}`,
                icon: climateRec.pieces?.[0]?.image || '/favicon.ico'
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn('Browser system notification skipped:', err);
    }

    return newNotification;
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        sendWeatherNotification,
        markAllAsRead,
        removeNotification,
        dismissToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
