import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { convertElapsedTime } from '@/lib/utils';
import React from 'react';

interface Props {
  id: number;
  name?: string;
  description?: string;
  duration?: number;
  currentCooldown: number;
  type?: string;
}

const SpellCard = ({
  name,
  description,
  currentCooldown,
  duration,
  type,
}: Props) => {
  return (
    <Card className="border-transparent shadow-none px-0">
      <CardHeader className="px-0 py-2">
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <span className="text-muted-foreground">Durée: {duration}s</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{type}</Badge>
        </div>
      </CardHeader>
      <CardDescription>{description}</CardDescription>
      <CardFooter className="px-0 py-4 flex justify-end">
        <Button className="w-full">
          {currentCooldown === 0 ? 'Prêt' : convertElapsedTime(currentCooldown)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpellCard;
