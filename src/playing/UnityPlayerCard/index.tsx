import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UnityPlayerCard = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-medium">Unity Simulator</span>
        <p className="text-xs text-muted-foreground">En jeu</p>
      </div>
    </div>
  );
};

export default UnityPlayerCard;
