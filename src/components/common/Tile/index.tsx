'use client';
import { tilesColor } from '@/api/colors';
import { TileType } from '@/api/tile';
import { TILE_SIZE } from '@/lib/constants';
import { useState } from 'react';
import { Rect } from 'react-konva';

interface Props {
  id: number;
  row: number;
  col: number;
  onClick: () => void;
}

const Tile = ({ id, row, col, onClick }: Props) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Rect
      key={`${row}-${col}`}
      x={col * TILE_SIZE}
      y={row * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fill={hovered ? 'black' : (tilesColor[id as TileType] ?? 'white')}
      stroke="#0000000d"
      onClick={onClick}
      onMouseMove={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

export default Tile;
