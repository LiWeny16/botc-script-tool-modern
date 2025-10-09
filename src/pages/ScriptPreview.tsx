import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useMediaQuery,
  createTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import { getScriptJsonUrl, loadScriptJson } from '../data/scriptRepository';
import { generateScript } from '../utils/scriptGenerator';
import CharacterSection from '../components/CharacterSection';
import NightOrder from '../components/NightOrder';
import { THEME_COLORS } from '../theme/colors';
import type { Script } from '../types';
import html2canvas from 'html2canvas';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function ScriptPreview() {
  const { scriptName } = useParams<{ scriptName: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState<string>('');
  const scriptRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const loadScript = async () => {
      if (!scriptName) {
        setError('未指定剧本名称');
        return;
      }

      const decodedName = decodeURIComponent(scriptName);
      
      // 从映射表中获取JSON URL
      const jsonUrl = getScriptJsonUrl(decodedName);

      if (!jsonUrl) {
        setError(`未找到剧本：${decodedName}`);
        return;
      }

      try {
        // 从URL加载JSON
        const jsonString = await loadScriptJson(jsonUrl);
        const generatedScript = generateScript(jsonString);
        setScript(generatedScript);
      } catch (err) {
        setError(`加载剧本失败：${err instanceof Error ? err.message : '未知错误'}`);
      }
    };

    loadScript();
  }, [scriptName]);

  const handleExportImage = async () => {
    if (!scriptRef.current || !script) return;

    try {
      const images = scriptRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
            setTimeout(() => resolve(null), 5000);
          });
        })
      );

      const canvas = await html2canvas(scriptRef.current, {
        scale: 2,
        backgroundColor: '#242424',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: scriptRef.current.scrollWidth,
        height: scriptRef.current.scrollHeight,
        windowWidth: scriptRef.current.scrollWidth,
        windowHeight: scriptRef.current.scrollHeight,
        imageTimeout: 0,
        removeContainer: true,
      });

      const link = document.createElement('a');
      link.download = `${script.title || '剧本'}.png`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    }
  };

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/repo')}
              variant="contained"
            >
              返回剧本仓库
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!script) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* 工具栏 */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/repo')}
            sx={{ color: THEME_COLORS.paper.primary }}
          >
            返回剧本仓库
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportImage}
            variant="contained"
            sx={{
              backgroundColor: THEME_COLORS.good,
              '&:hover': {
                backgroundColor: THEME_COLORS.good,
                opacity: 0.9,
              },
            }}
          >
            导出图片
          </Button>
        </Box>

        {/* 剧本展示区域 */}
        <Box
          id="script-preview"
          ref={scriptRef}
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              gap: '2px',
              alignItems: 'stretch',
            }}
          >
            {/* 左侧 - 首个夜晚 */}
            {!isMobile && (
              <Box
                sx={{
                  padding: 1.5,
                  flexShrink: 0,
                  backgroundColor: THEME_COLORS.nightOrder.background,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  pt: '33.33%',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='6' seed='2' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0.15 0 0.25 0 0 0.35 0 0 0.45'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    opacity: 0.5,
                    pointerEvents: 'none',
                    backgroundSize: '150px 150px',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    background: `
                      radial-gradient(circle at 15% 25%, rgba(10, 12, 15, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 45% 15%, rgba(8, 10, 12, 0.85) 0%, transparent 4%),
                      radial-gradient(circle at 75% 35%, rgba(5, 8, 10, 0.95) 0%, transparent 2.5%),
                      radial-gradient(circle at 35% 55%, rgba(12, 15, 18, 0.8) 0%, transparent 3.5%),
                      radial-gradient(circle at 85% 65%, rgba(8, 10, 12, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 20% 75%, rgba(6, 8, 10, 0.85) 0%, transparent 4%),
                      radial-gradient(circle at 60% 85%, rgba(10, 12, 15, 0.95) 0%, transparent 2%),
                      radial-gradient(circle at 90% 20%, rgba(8, 10, 12, 0.75) 0%, transparent 3.5%),
                      radial-gradient(circle at 50% 45%, rgba(6, 8, 10, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 10% 90%, rgba(10, 12, 15, 0.85) 0%, transparent 4%)
                    `,
                    backgroundSize: '100% 100%',
                    pointerEvents: 'none',
                  },
                  '& > *': {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
              >
                <NightOrder title="首个夜晚" actions={script.firstnight} />
              </Box>
            )}

            {/* 中间 - 主要内容区域 */}
            <Paper
              elevation={0}
              sx={{
                pb: 2,
                pt: 2,
                flex: 1,
                maxWidth: '1200px',
                backgroundImage: 'url(/bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 0,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'none',
              }}
            >
              {/* 装饰性花纹 */}
              <Box
                component="img"
                src="https://clocktower-wiki.gstonegames.com/skins/pivot/assets/image/flower3.png"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  maxWidth: { xs: '25%', sm: '20%', md: '15%' },
                  opacity: 0.25,
                  pointerEvents: 'none',
                }}
              />
              <Box
                component="img"
                src="https://clocktower-wiki.gstonegames.com/skins/pivot/assets/image/flower4.png"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  maxWidth: { xs: '25%', sm: '20%', md: '15%' },
                  opacity: 0.25,
                  pointerEvents: 'none',
                }}
              />

              {/* 标题区域 */}
              <Box sx={{ textAlign: 'center', mb: 2, position: 'relative', zIndex: 1, px: { xs: 1, sm: 2 } }}>
                {!isMobile && script.author && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: { sm: 20, md: 30 },
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      sx={{
                        color: THEME_COLORS.paper.secondary,
                        fontSize: { sm: '0.85rem' },
                        mb: 0.3,
                      }}
                    >
                      剧本作者：{script.author}
                      <br />
                      支持7-15人
                    </Typography>
                  </Box>
                )}

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: THEME_COLORS.paper.primary,
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                    mb: { xs: 0.5, sm: 0.5 },
                  }}
                >
                  {script.title}
                </Typography>

                {isMobile && script.author && (
                  <Typography
                    sx={{
                      color: THEME_COLORS.paper.secondary,
                      fontSize: '0.75rem',
                      mt: 0.5,
                    }}
                  >
                    作者：{script.author} · 支持7-15人
                  </Typography>
                )}
              </Box>

              {/* 角色区域 */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <CharacterSection
                  team="townsfolk"
                  characters={script.characters.townsfolk}
                  script={script}
                  onReorder={() => {}} // 预览模式不允许重新排序
                />
                <CharacterSection
                  team="outsider"
                  characters={script.characters.outsider}
                  script={script}
                  onReorder={() => {}}
                />
                <CharacterSection
                  team="minion"
                  characters={script.characters.minion}
                  script={script}
                  onReorder={() => {}}
                />
                <CharacterSection
                  team="demon"
                  characters={script.characters.demon}
                  script={script}
                  onReorder={() => {}}
                />
              </Box>

              {/* 移动端夜晚行动顺序 */}
              {isMobile && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1.5, position: 'relative', zIndex: 1, px: { xs: 1, sm: 2, md: 3 } }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NightOrder title="首个夜晚" actions={script.firstnight} isMobile={true} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NightOrder title="其他夜晚" actions={script.othernight} isMobile={true} />
                  </Box>
                </Box>
              )}

              {/* 说明文字 */}
              <Box sx={{ mt: 2.5, position: 'relative', zIndex: 1, px: { xs: 1, sm: 2, md: 3 } }}>
                <Box
                  sx={{
                    border: '2px solid rgba(61, 50, 38, 0.4)',
                    borderRadius: 2,
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: 'rgba(254, 250, 240, 0.5)',
                    mb: 1,
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: THEME_COLORS.paper.secondary,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      可使
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: THEME_COLORS.paper.secondary,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        ml: 1,
                      }}
                    >
                      某些事情"可能"发生。代表由说书人来决定该事情是否发生。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: THEME_COLORS.paper.secondary,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      中毒
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: THEME_COLORS.paper.secondary,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        ml: 1,
                      }}
                    >
                      中毒的玩家会失去能力，但会认为自己的真实有能力。说书人会给出该玩家应得的错误信息，让玩家不可能会给出中毒信息。中毒的玩家不会得知自己中毒。
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* 右侧 - 其他夜晚 */}
            {!isMobile && (
              <Box
                sx={{
                  padding: 1.5,
                  flexShrink: 0,
                  backgroundColor: THEME_COLORS.nightOrder.background,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  pt: '33.33%',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='6' seed='2' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0.15 0 0.25 0 0 0.35 0 0 0.45'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    opacity: 0.5,
                    pointerEvents: 'none',
                    backgroundSize: '150px 150px',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    background: `
                      radial-gradient(circle at 15% 25%, rgba(10, 12, 15, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 45% 15%, rgba(8, 10, 12, 0.85) 0%, transparent 4%),
                      radial-gradient(circle at 75% 35%, rgba(5, 8, 10, 0.95) 0%, transparent 2.5%),
                      radial-gradient(circle at 35% 55%, rgba(12, 15, 18, 0.8) 0%, transparent 3.5%),
                      radial-gradient(circle at 85% 65%, rgba(8, 10, 12, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 20% 75%, rgba(6, 8, 10, 0.85) 0%, transparent 4%),
                      radial-gradient(circle at 60% 85%, rgba(10, 12, 15, 0.95) 0%, transparent 2%),
                      radial-gradient(circle at 90% 20%, rgba(8, 10, 12, 0.75) 0%, transparent 3.5%),
                      radial-gradient(circle at 50% 45%, rgba(6, 8, 10, 0.9) 0%, transparent 3%),
                      radial-gradient(circle at 10% 90%, rgba(10, 12, 15, 0.85) 0%, transparent 4%)
                    `,
                    backgroundSize: '100% 100%',
                    pointerEvents: 'none',
                  },
                  '& > *': {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
              >
                <NightOrder title="其他夜晚" actions={script.othernight} />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

