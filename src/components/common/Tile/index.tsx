'use client';
import { tilesColor } from '@/api/colors';
import { TILE_SIZE } from '@/lib/constants';
import { Rect } from 'react-konva';

interface Props {
  id: number;
  row: number;
  col: number;
  onClick: () => void;
  hovered: boolean;
}

const Tile = ({ id, row, col, hovered, onClick }: Props) => {
  return (
    <Rect
      key={`${row}-${col}`}
      x={col * TILE_SIZE}
      y={row * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fill={hovered ? 'black' : (tilesColor[id] ?? 'white')}
      stroke="#0000000d"
      onClick={onClick}
    />
  );
};

export default Tile;
