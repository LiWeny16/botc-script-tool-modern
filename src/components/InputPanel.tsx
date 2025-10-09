import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Stack,
  Collapse,
} from '@mui/material';
import {
  Upload,
  Download,
  Refresh,
  Settings,
  ExpandMore,
  ExpandLess,
  LibraryBooks,
} from '@mui/icons-material';

interface InputPanelProps {
  onGenerate: (json: string, title?: string, author?: string) => void;
  onExportImage: () => void;
  onExportJson: () => void;
  hasScript: boolean;
}

export default function InputPanel({ onGenerate, onExportImage, onExportJson, hasScript }: InputPanelProps) {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    try {
      setError('');
      if (!jsonInput.trim()) {
        setError('请输入剧本 JSON 数据');
        return;
      }
      onGenerate(jsonInput, titleInput, authorInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析 JSON 失败');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setTitleInput('');
    setAuthorInput('');
    setError('');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        mb: 3,
        backgroundColor: '#fefefe',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
          }}
        >
          血染钟楼剧本生成器
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LibraryBooks />}
          onClick={() => navigate('/repo')}
          sx={{
            borderColor: '#0078ba',
            color: '#0078ba',
            '&:hover': {
              borderColor: '#005a8c',
              backgroundColor: 'rgba(0, 120, 186, 0.08)',
            },
          }}
        >
          剧本仓库
        </Button>
      </Box>

      <Stack spacing={2}>
        {/* JSON 输入框 */}
        <TextField
          multiline
          rows={6}
          fullWidth
          label="剧本 JSON"
          placeholder='粘贴官方剧本制作器导出的 JSON 数据...'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
            },
          }}
        />

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* 主要操作按钮 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleGenerate}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 auto' },
              minWidth: { sm: 120 },
            }}
          >
            生成剧本
          </Button>

          <Button
            variant="outlined"
            size="large"
            component="label"
            startIcon={<Upload />}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            上传 JSON
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Download />}
            onClick={onExportImage}
            disabled={!hasScript}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            导出图片
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Download />}
            onClick={onExportJson}
            disabled={!hasScript}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            复制 JSON
          </Button>

          <Button
            variant="outlined"
            size="large"
            color="secondary"
            startIcon={<Refresh />}
            onClick={handleClear}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 1 auto' },
            }}
          >
            清空
          </Button>
        </Box>

        {/* 高级选项 */}
        <Box>
          <Button
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
            sx={{ mb: 1 }}
          >
            <Settings sx={{ mr: 1, fontSize: 20 }} />
            高级选项
          </Button>

          <Collapse in={showAdvanced}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="剧本标题（可选）"
                placeholder="自定义剧本"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="剧本作者（可选）"
                placeholder="作者名称"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Collapse>
        </Box>

        {/* 提示信息 */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
            • 支持官方剧本制作器的剧本 JSON<br />
            • 支持鸦木布拉夫、汀西维尔、福波斯等各个人数的剧本格式<br />
            • 2025/1/3 之后的实验性角色暂未录入，请使用完整 JSON 信息
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );
}
