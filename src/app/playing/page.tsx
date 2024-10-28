'use client';
import { tilesColor, TileType } from '@/api/colors';
import { Item, itemDescriptionMap } from '@/api/item';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import RandomNumberEventDialog from '@/events/RandomNumberEventDialog';
import { toast } from '@/hooks/use-toast';
import { useItemForm } from '@/hooks/useItemForm';
import { convertElapsedTime } from '@/lib/utils';
import BlindDialog from '@/playing/BlindDialog';
import FinishedDialog from '@/playing/FinishedDialog';
import HelpDialog from '@/playing/HelpDialog';
import PlayerCard from '@/playing/PlayerCard';
import ShopCard from '@/playing/ShopCard';
import SpecialItemCard from '@/playing/SpecialItemCard';
import SpellCard from '@/playing/SpellCard';
import TrapPopover from '@/playing/TrapPopover';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PlayingPage = () => {
  const {
    gameState,
    map,
    player,
    players,
    devMode,
    socket,
    unityPlayer,
    resetGame,
  } = useWebSocket();
  const { onSubmit, form, setTarget } = useItemForm();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<{
    row: number;
    col: number;
  }>();
  const [openedPopover, setOpenedPopover] = useState<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (gameState.status === 'LOBBY') {
      resetGame();
      redirect('/');
    }
  }, [gameState]);

  const handleClick = (x: number, y: number) => {
    if (!player) {
      toast({
        title: 'Oops...',
        description: 'Il faut être un joueur pour déclencher des pièges',
      });
      return;
    }

    if (
      map &&
      map[x] &&
      map[x][y] !== TileType.Sidewalks &&
      map[x][y] !== TileType.Crosswalks
    ) {
      toast({
        title: 'Oops...',
        description: "Cette case ne peut pas recevoir d'items.",
        variant: 'destructive',
      });
      return;
    }

    const marked = gameState.items.some(
      (item) => item.coords.x === x && item.coords.y === y,
    );
    if (!marked) {
      setDialogOpened(true);
      setTarget({ x, y });
      return;
    }
    if (!openedPopover.some((item) => item.x == x && item.y == y)) {
      setOpenedPopover((openedPopover) => [...openedPopover, { x, y }]);
    }
  };

  const onClose = (x: number, y: number) => {
    setOpenedPopover((openedPopover) =>
      openedPopover.filter((item) => item.x !== x && item.y !== y),
    );
  };

  const traps = gameState.items.reduce((traps, item) => {
    if (!traps[item.coords.x]) {
      traps[item.coords.x] = [];
    }
    traps[item.coords.x][item.coords.y] = item;
    return traps;
  }, [] as Item[][]);

  const getColorOfItem = (name: string) => {
    switch (name) {
      case 'Coin':
        return '#ffef00';
      case 'Wall':
        return '#8b7355';
      default:
        return 'red';
    }
  };

  const getTileBackground = (row: number, col: number, map: number[][]) => {
    if (
      unityPlayer?.position &&
      Math.trunc(unityPlayer?.position?.x) === row &&
      Math.trunc(unityPlayer?.position?.y) === col
    ) {
      return 'purple';
    }
    const item = gameState.items.find(
      (item) => item.coords.x === row && item.coords.y === col,
    );
    if (item) {
      return getColorOfItem(item.name);
    }
    if (hoveredPosition?.col === col && hoveredPosition.row === row) {
      return 'black';
    }
    return tilesColor[map[row][col]] ?? 'white';
  };

  return (
    <>
      <header className="flex items-center py-2 px-10 justify-between border-b">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {player ? player.name.charAt(0).toUpperCase() : 'D'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{player?.name ?? 'Dummy'}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {player?.role ?? 'Spectateur'}
            </span>
          </div>
        </div>
        <nav>
          <ul className="flex items-center gap-4">
            {player && (
              <li>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>Lancer un sort</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <ScrollArea className="h-screen">
                      <SheetHeader>
                        <SheetTitle>Manuel des sorts</SheetTitle>
                        <SheetDescription>
                          Chaque sort déclenché affecte immédiatement le joueur
                          en jeu et dispose d’un délai de récupération unique
                          (cooldown).
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col mt-4">
                        <div className="flex flex-col mt-4">
                          {player?.spells.map((spell, index) => (
                            <>
                              <SpellCard
                                key={index}
                                id={index}
                                name={spell.name}
                                description={spell.description}
                                duration={spell.duration}
                                currentCooldown={spell.currentCooldown}
                                type={spell.type}
                              />
                              <Separator className="my-2" />
                            </>
                          ))}
                        </div>
                      </div>
                      {player.specialItems &&
                        player.specialItems.length > 0 && (
                          <>
                            <SheetHeader>
                              <SheetTitle>Items spéciaux</SheetTitle>
                              <SheetDescription>
                                Les items spéciaux sont des objets rares,
                                disponibles exclusivement en boutique, et
                                utilisables une seule fois.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 mt-4">
                              {player.specialItems?.map((item) => (
                                <SpecialItemCard key={item.id} item={item} />
                              ))}
                            </div>
                          </>
                        )}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </li>
            )}
            <li>
              {devMode && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive">Relancer la partie</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action entrainera une réinitialisation complète de
                        la partie.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          socket?.emit('restart', undefined);
                          resetGame();
                          redirect('/');
                        }}
                      >
                        Continuer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </li>
            <li>
              <HelpDialog />
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex justify-between px-10">
        {map && (
          <div
            className="grid gap-x-0 h-[80vh]"
            style={{
              gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${map.length}, minmax(0, 1fr))`,
            }}
          >
            {[...Array(map.length)].map((_, row) =>
              [...Array(map[row].length)].map((_, col) => {
                return (
                  <>
                    <div
                      key={`${row}-${col}`}
                      data-testid={`${row}-${col}`}
                      className="relative w-[1.1vw] h-[1.1vw] border border-border cursor-pointer"
                      onMouseMove={() =>
                        setHoveredPosition({ row: map.length - 1 - row, col })
                      }
                      style={{
                        background: getTileBackground(
                          map.length - 1 - row,
                          col,
                          map,
                        ),
                      }}
                      onClick={() => handleClick(map.length - 1 - row, col)}
                    >
                      {openedPopover.some(
                        (item) =>
                          item.x == map.length - 1 - row && item.y == col,
                      ) &&
                        traps[map.length - 1 - row] &&
                        traps[map.length - 1 - row][col] && (
                          <TrapPopover
                            key={traps[map.length - 1 - row][col].id}
                            id={traps[map.length - 1 - row][col].id}
                            name={traps[map.length - 1 - row][col].name}
                            duration={traps[map.length - 1 - row][col].duration}
                            owner={traps[map.length - 1 - row][col].owner}
                            password={traps[map.length - 1 - row][col].password}
                            row={map.length - 1 - row}
                            col={col}
                            onClose={() => onClose(map.length - 1 - row, col)}
                          />
                        )}
                    </div>
                  </>
                );
              }),
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Statut de jeu</CardTitle>
              <CardDescription>
                Représentation globale de l{"'"}état de la partie.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <ul>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Temps de jeu</span>
                    <span>{convertElapsedTime(gameState.timer)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Boucles</span>
                    <span>{gameState.loops}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Annulation de piège dans
                    </span>
                    <span>
                      {player &&
                        (player.cancelCooldown === 0
                          ? 'Prêt'
                          : convertElapsedTime(player.cancelCooldown ?? 0))}
                      {!player && 'N/A'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Event dans</span>
                    <span>{convertElapsedTime(gameState.eventTimer)}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Joueurs connectés</CardTitle>
              <CardDescription>Ainsi que leurs équipes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-36">
                <div className="flex flex-col gap-2">
                  {players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <ShopCard />
        </div>
      </div>
      <Dialog
        open={dialogOpened}
        onOpenChange={() => setDialogOpened(!dialogOpened)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tu {"l'"}entends ce bruit ?</DialogTitle>
            <DialogDescription>
              {itemDescriptionMap[form.getValues('item')] ?? ''}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {player?.items.map((item) => (
                        <SelectItem key={item.id} value={item.type}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <DialogFooter className="mt-2">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  onClick={() => {
                    setDialogOpened(false);
                  }}
                >
                  Piéger la case
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <FinishedDialog open={gameState.status === 'FINISHED'} />
      {player?.blind && <BlindDialog />}
      {gameState.currentEvent?.type === 'RANDOM_NUMBER' && (
        <RandomNumberEventDialog event={gameState.currentEvent} />
      )}
    </>
  );
};

export default PlayingPage;
