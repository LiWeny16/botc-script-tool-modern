import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActionArea,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { searchScripts, type ScriptData } from '../data/scriptRepository';
import { THEME_COLORS } from '../theme/colors';

export default function ScriptRepository() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [scripts, setScripts] = useState<ScriptData[]>(searchScripts(''));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setScripts(searchScripts(query));
  };

  const handleScriptClick = (scriptName: string) => {
    navigate(`/repo/${encodeURIComponent(scriptName)}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* 返回按钮 */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: THEME_COLORS.paper.primary,
            }}
          >
            返回剧本生成器
          </Button>
        </Box>

        {/* 标题 */}
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 1,
            color: THEME_COLORS.paper.primary,
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
          }}
        >
          剧本仓库
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            mb: 4,
            color: THEME_COLORS.paper.secondary,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          浏览和预览血染钟楼剧本
        </Typography>

        {/* 搜索框 */}
        <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索剧本名称、作者..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: THEME_COLORS.gray,
                },
                '&:hover fieldset': {
                  borderColor: THEME_COLORS.good,
                },
                '&.Mui-focused fieldset': {
                  borderColor: THEME_COLORS.good,
                },
              },
            }}
          />
        </Box>

        {/* 剧本列表 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {scripts.map((script) => (
            <Card
              key={script.id}
              sx={{
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleScriptClick(script.name)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: THEME_COLORS.paper.primary,
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                    }}
                  >
                    {script.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: THEME_COLORS.good,
                      mb: 1.5,
                      fontSize: '0.9rem',
                    }}
                  >
                    作者：{script.author}
                  </Typography>
                  <Typography
                    sx={{
                      color: THEME_COLORS.paper.secondary,
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {script.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* 无结果提示 */}
        {scripts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              sx={{
                color: THEME_COLORS.gray,
                fontSize: '1.1rem',
              }}
            >
              未找到匹配的剧本
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

