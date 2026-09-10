import React, { createContext, useContext, useState, useEffect } from 'react';
import { alertService } from '../services/alertService';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await alertService.getAlerts();
      if (res.success) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const activeAlertCount = alerts.filter((a) => a.status === 'Active').length;

  const acknowledgeAlert = async (id) => {
    await alertService.acknowledgeAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    );
  };

  const resolveAlert = async (id) => {
    await alertService.resolveAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        activeAlertCount,
        loading,
        fetchAlerts,
        acknowledgeAlert,
        resolveAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
