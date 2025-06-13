import { useState, useEffect } from 'react';

interface ApiSettings {
  [key: string]: string;
}

const API_SETTINGS_KEY = 'econai_api_settings';

export function useApiSettings() {
  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(API_SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setApiSettings(parsedSettings);
        console.log('API settings loaded:', Object.keys(parsedSettings).length, 'models configured');
      } else {
        console.log('No saved API settings found');
      }
    } catch (error) {
      console.error('Error loading API settings:', error);
              // If JSON parsing fails, clear corrupted data
      localStorage.removeItem(API_SETTINGS_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save API settings
  const saveApiSettings = (newSettings: ApiSettings) => {
    try {
      localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(newSettings));
      setApiSettings(newSettings);
      console.log('API settings saved:', Object.keys(newSettings).length, 'models configured');
      return true;
    } catch (error) {
      console.error('Error saving API settings:', error);
      return false;
    }
  };

  // Update single API setting
  const updateApiSetting = (modelKey: string, apiKey: string) => {
    const newSettings = {
      ...apiSettings,
      [modelKey]: apiKey
    };
    return saveApiSettings(newSettings);
  };

  // Delete API setting
  const removeApiSetting = (modelKey: string) => {
    const newSettings = { ...apiSettings };
    delete newSettings[modelKey];
    return saveApiSettings(newSettings);
  };

  // Clear all API settings
  const clearAllApiSettings = () => {
    try {
      localStorage.removeItem(API_SETTINGS_KEY);
      setApiSettings({});
      console.log('All API settings cleared');
      return true;
    } catch (error) {
      console.error('Error clearing API settings:', error);
      return false;
    }
  };

  // Check if API setting exists
  const hasApiKey = (modelKey: string) => {
    return !!apiSettings[modelKey];
  };

  // Get API key
  const getApiKey = (modelKey: string) => {
    return apiSettings[modelKey] || '';
  };

  // Get count of configured models
  const getConfiguredModelsCount = () => {
    return Object.keys(apiSettings).filter(key => apiSettings[key]).length;
  };

  return {
    apiSettings,
    isLoaded,
    saveApiSettings,
    updateApiSetting,
    removeApiSetting,
    clearAllApiSettings,
    hasApiKey,
    getApiKey,
    getConfiguredModelsCount
  };
} 