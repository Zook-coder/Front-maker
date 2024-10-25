import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { CircleHelp } from 'lucide-react';
import { useState } from 'react';

const HelpDialog = () => {
  const { player } = useWebSocket();
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="icon" onClick={() => setOpen(true)}>
          <CircleHelp />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comment ça marche ?</DialogTitle>
          <DialogDescription>
            Vous êtes{' '}
            <span className="font-semibold">
              {player?.role ?? 'Spectateur'}
            </span>
          </DialogDescription>
          <span className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            ipsa quia distinctio esse ab. Reprehenderit?
          </span>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger>
            <Button onClick={() => setOpen(false)}>Compris !</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
