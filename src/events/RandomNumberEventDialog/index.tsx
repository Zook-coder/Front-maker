import { Event } from '@/api/event';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';

interface Props {
  event?: Event;
}

const RandomNumberEventDialog = ({ event }: Props) => {
  const { gameState } = useWebSocket();

  if (!event) {
    return null;
  }

  return (
    <Drawer open={gameState.status === 'EVENT'} dismissible={false}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Un nouvel évènement !</DrawerTitle>
            <DrawerDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis, eos?
            </DrawerDescription>
          </DrawerHeader>
          <div className="text-center">
            <div className="text-7xl font-bold tracking-tighter">
              {convertElapsedTime(event.timer)}
            </div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              Temps restant
            </div>
          </div>
          <div className="mt-3 h-[60px] p-4">
            <Input
              autoFocus
              placeholder="Veuillez choisir un nombre entre 1 et 100"
            />
          </div>
          <DrawerFooter>
            <Button>Soumettre</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RandomNumberEventDialog;
