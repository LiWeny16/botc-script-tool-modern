import { Box, Typography, Paper } from '@mui/material';
import type { Character } from '../types';
import { highlightAbilityText } from '../utils/scriptGenerator';
import { THEME_COLORS } from '../theme/colors';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CharacterCardProps {
  character: Character;
  jinxInfo?: Record<string, string>;
  allCharacters?: Character[];
}

export default function CharacterCard({ character, jinxInfo, allCharacters }: CharacterCardProps) {
  // 判断角色是善良阵营还是邪恶阵营
  const isGoodTeam = character.team === 'townsfolk' || character.team === 'outsider';
  const nameColor = isGoodTeam ? THEME_COLORS.good : THEME_COLORS.evil;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: character.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={isDragging ? 6 : 0}
      sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        backgroundColor: 'transparent',
        borderRadius: 1,
        transition: 'all 0.2s',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* 角色头像 */}
      <Box
        component="img"
        src={character.image}
        alt={character.name}
        sx={{
          width: { xs: 50, sm: 55, md: 60 },
          height: { xs: 50, sm: 55, md: 60 },
          borderRadius: 1,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* 角色信息 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
            mb: 0.3,
            color: nameColor,
            lineHeight: 1.3,
          }}
        >
          {character.name}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            lineHeight: 1.5,
            color: THEME_COLORS.text.tertiary,
          }}
          dangerouslySetInnerHTML={{
            __html: highlightAbilityText(character.ability),
          }}
        />

        {/* 相克规则 */}
        {jinxInfo && Object.keys(jinxInfo).length > 0 && (
          <Box sx={{ mt: 0.5 }}>
            {Object.entries(jinxInfo).map(([targetName, jinxText]) => {
              const targetChar = allCharacters?.find((c) => c.name === targetName);
              return (
                <Box
                  key={targetName}
                  sx={{
                    display: 'flex',
                    gap: 0.6,
                    alignItems: 'flex-start',
                    mt: 0.5,
                    p: 0.6,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 0.5,
                    border: '1px solid rgba(255, 232, 157, 0.8)',
                  }}
                >
                  {targetChar && (
                    <Box
                      component="img"
                      src={targetChar.image}
                      alt={targetName}
                      sx={{
                        width: { xs: 20, sm: 22, md: 24 },
                        height: { xs: 20, sm: 22, md: 24 },
                        borderRadius: 0.5,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.72rem' },
                      color: THEME_COLORS.text.primary,
                      lineHeight: 1.4,
                      flex: 1,
                      fontStyle: 'italic',
                    }}
                  >
                    （相克规则：{jinxText}）
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
