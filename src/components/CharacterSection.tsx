import { Box, Typography, Divider } from '@mui/material';
import type { Character, Script } from '../types';
import { TEAM_NAMES, TEAM_COLORS } from '../data/characters';
import { THEME_COLORS } from '../theme/colors';
import CharacterCard from './CharacterCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface CharacterSectionProps {
  team: 'townsfolk' | 'outsider' | 'minion' | 'demon';
  characters: Character[];
  script: Script;
  onReorder: (team: 'townsfolk' | 'outsider' | 'minion' | 'demon', newOrder: string[]) => void;
}

export default function CharacterSection({ team, characters, script, onReorder }: CharacterSectionProps) {
  if (characters.length === 0) return null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const teamLabel =
    team === 'townsfolk' || team === 'outsider'
      ? '善良阵营'
      : '邪恶阵营';
  
  const teamLabelColor = 
    team === 'townsfolk' || team === 'outsider'
      ? THEME_COLORS.good
      : THEME_COLORS.evil;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = characters.findIndex((c) => c.id === active.id);
      const newIndex = characters.findIndex((c) => c.id === over.id);
      
      const newOrder = arrayMove(characters, oldIndex, newIndex).map(c => c.id);
      onReorder(team, newOrder);
    }
  };

  return (
    <Box
      sx={{
        // mb: 2,
        p: 1,
        backgroundColor: 'transparent',
        // borderRadius: 1.5,
      }}
    >
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // mb: 1.2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          }}
        >
          <span style={{ color: teamLabelColor }}>{teamLabel}</span>
          ·
          <span style={{ color: TEAM_COLORS[team] }}>{TEAM_NAMES[team]}</span>
        </Typography>
        <Divider
          sx={{
            flex: 1,
            ml: 1.5,
            borderColor: THEME_COLORS.gray,
            borderWidth: 1,
          }}
        />
      </Box>

      {/* 角色卡片 - 两列布局 + 拖拽排序 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={characters.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* 左列 */}
            <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {characters
                .filter((_, index) => index % 2 === 0)
                .map((character, idx, arr) => (
                  <Box
                    key={character.id}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      mb: idx < arr.length - 1 ? 1 : 0,
                    }}
                  >
                    <CharacterCard
                      character={character}
                      jinxInfo={script.jinx[character.name]}
                      allCharacters={script.all}
                    />
                  </Box>
                ))}
            </Box>

            {/* 右列 */}
            <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {characters
                .filter((_, index) => index % 2 === 1)
                .map((character, idx, arr) => (
                  <Box
                    key={character.id}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      mb: idx < arr.length - 1 ? 1 : 0,
                    }}
                  >
                    <CharacterCard
                      character={character}
                      jinxInfo={script.jinx[character.name]}
                      allCharacters={script.all}
                    />
                  </Box>
                ))}
            </Box>
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
