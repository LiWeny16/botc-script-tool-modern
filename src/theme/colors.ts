// 血染钟楼剧本生成器 - 统一颜色配置

// 主题颜色
export const THEME_COLORS = {
  // 善良阵营 - 蓝色系
  good: '#0078ba',
  
  // 邪恶阵营 - 红色系
  evil: '#b21e1d',
  
  // 其他颜色
  purple: '#dd38ca',  // 旅行者等特殊标记
  gray: '#999',       // 分割线等
  
  // 背景色
  paper: {
    primary: '#2c2416',
    secondary: '#3d3226',
  },
  
  // 夜晚顺序栏背景
  nightOrder: {
    background: '#1a1d20',
  },
  
  // 文字颜色
  text: {
    primary: '#000000',     // 主要文字 - 黑色
    secondary: '#000000',   // 次要文字 - 深灰
    tertiary: '#000000',    // 三级文字 - 灰色
  },
} as const;

// 全局字体样式配置
export const THEME_FONTS = {
  // 主要字体系列
  fontFamily: '"Source Han Serif", "Source Han Serif SC", "Noto Serif CJK SC", "思源宋体", "Microsoft YaHei", "PingFang SC", serif',
  
  // 备用字体系列（用于特殊场景）
  fallbackFontFamily: '"Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif',
} as const;

// 团队颜色映射
export const TEAM_COLORS: Record<string, string> = {
  townsfolk: THEME_COLORS.good,    // 镇民 - 蓝色
  outsider: THEME_COLORS.good,     // 外来者 - 蓝色
  minion: THEME_COLORS.evil,       // 爪牙 - 红色
  demon: THEME_COLORS.evil,        // 恶魔 - 红色
  traveler: '#808080',             // 旅行者 - 灰色
};

// 团队名称映射
export const TEAM_NAMES: Record<string, string> = {
  townsfolk: '镇民',
  outsider: '外来者',
  minion: '爪牙',
  demon: '恶魔',
  traveler: '旅行者',
};

