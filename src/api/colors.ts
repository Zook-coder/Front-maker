export enum TileType {
  Roads = 0,
  Walls = 1,
  Sidewalks = 2,
  Crosswalks = 3,
  House = 4,
  Trees = 5,
  Lakes = 6,
  Start = 7,
  End = 8,
}

export const tilesColor: Record<TileType | number, string> = {
  [TileType.Roads]: '#4b5563',
  [TileType.Walls]: '#A9A9A9',
  [TileType.Sidewalks]: '#e5e7eb',
  [TileType.Crosswalks]: '#fffacd',
  [TileType.House]: '#9ca3af',
  [TileType.Trees]: '#6b7280',
  [TileType.Lakes]: '#87ceeb',
  [TileType.Start]: '#1f2937',
  [TileType.End]: '#111827',
};
