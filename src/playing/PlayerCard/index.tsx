import { Player } from '@/api/player';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Props {
  player: Player;
}

const PlayerCard = ({ player }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-medium">{player.name}</span>
        <p className="text-xs text-muted-foreground">
          {player.type === 'UNITY' ? 'Unity' : player.role}
        </p>
      </div>
    </div>
  );
};

export default PlayerCard;
