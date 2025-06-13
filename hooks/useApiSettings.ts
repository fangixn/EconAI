import { useState, useEffect } from 'react';

interface ApiSettings {
  [key: string]: string;
}

const API_SETTINGS_KEY = 'econai_api_settings';

export function useApiSettings() {
  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载API设置
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
      // 如果JSON解析失败，清除损坏的数据
      localStorage.removeItem(API_SETTINGS_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 保存API设置
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

  // 更新单个API设置
  const updateApiSetting = (modelKey: string, apiKey: string) => {
    const newSettings = {
      ...apiSettings,
      [modelKey]: apiKey
    };
    return saveApiSettings(newSettings);
  };

  // 删除API设置
  const removeApiSetting = (modelKey: string) => {
    const newSettings = { ...apiSettings };
    delete newSettings[modelKey];
    return saveApiSettings(newSettings);
  };

  // 清除所有API设置
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

  // 检查API设置是否存在
  const hasApiKey = (modelKey: string) => {
    return !!apiSettings[modelKey];
  };

  // 获取API密钥
  const getApiKey = (modelKey: string) => {
    return apiSettings[modelKey] || '';
  };

  // 获取已配置的模型数量
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