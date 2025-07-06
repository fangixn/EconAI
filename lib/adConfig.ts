// 广告配置文件
export const AD_CONFIG = {
  // 谷歌广告客户端ID
  GOOGLE_AD_CLIENT: 'ca-pub-8773372379395342',
  
  // 广告位ID配置
  AD_SLOTS: {
    // 首页中部横幅广告
    HOME_MIDDLE_BANNER: 'YOUR_AD_SLOT_ID_1',
    // 首页底部横幅广告
    HOME_BOTTOM_BANNER: 'YOUR_AD_SLOT_ID_2',
    // 侧边栏广告
    SIDEBAR_AD: 'YOUR_AD_SLOT_ID_3',
  },
  
  // 广告格式配置
  AD_FORMATS: {
    AUTO: 'auto',
    RECTANGLE: 'rectangle',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
  }
};

// 检查广告位ID是否已配置
export function isAdSlotConfigured(adSlot: string): boolean {
  return adSlot !== '' && !adSlot.startsWith('YOUR_AD_SLOT_ID');
}

// 获取广告位配置说明
export function getAdSlotDescription(slotKey: string): string {
  switch (slotKey) {
    case 'HOME_MIDDLE_BANNER':
      return '首页中部横幅广告 - 推荐尺寸: 728x90 或 responsive';
    case 'HOME_BOTTOM_BANNER':
      return '首页底部横幅广告 - 推荐尺寸: 728x90 或 responsive';
    case 'SIDEBAR_AD':
      return '侧边栏广告 - 推荐尺寸: 300x250 或 responsive';
    default:
      return '广告位';
  }
} 