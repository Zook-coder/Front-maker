import { Item } from '@/api/item';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { convertElapsedTime } from '@/lib/utils';
import React from 'react';

interface Props {
  item: Item;
}

const SpecialItemCard = ({ item }: Props) => {
  return (
    <Card className="border-transparent shadow-none px-0">
      <CardHeader className="px-0 py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <span className="text-muted-foreground text-sm">
            Durée: {item.duration}s
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="px-0 flex justify-end">
        <Button className="w-full">
          {item.cooldown === 0 ? 'Prêt' : convertElapsedTime(item.cooldown)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpecialItemCard;
