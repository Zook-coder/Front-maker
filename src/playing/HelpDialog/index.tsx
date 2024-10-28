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
          {player?.role && player.role === 'Evilman' && (
            <span className="text-sm">
              L’Evilman est le principal antagoniste, déterminé à bloquer le
              joueur dans sa quête en plaçant des pièges sournois et des sorts
              entravant sa progression. Son objectif ? Empêcher le joueur
              d’atteindre le point d’arrivée à tout prix !
            </span>
          )}
          {player?.role && player.role === 'Protector' && (
            <span className="text-sm">
              Le Protecteur est un allié essentiel pour le joueur, chargé de
              contrecarrer les plans de l’Evilman. Son rôle est d’annuler les
              pièges semés sur le chemin et d’appliquer des buffs stratégiques
              au joueur.
            </span>
          )}
          {!player?.role && (
            <span className="text-sm">
              Le Spectateur observe le déroulement de la partie sans interagir
              directement avec le jeu. Ne pouvant poser d’actions, il profite
              d’une vue d’ensemble des stratégies et des confrontations entre le
              joueur, le Protecteur, et l’Evilman.
            </span>
          )}
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
