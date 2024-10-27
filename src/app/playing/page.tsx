'use client';
import { tilesColor } from '@/api/colors';
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
import { useItemForm } from '@/hooks/useItemForm';
import { convertElapsedTime } from '@/lib/utils';
import SpellCard from '@/playing/SpellCard';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Item } from '@/api/item';
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
import TrapPopover from '@/playing/TrapPopover';
import HelpDialog from '@/playing/HelpDialog';
import FinishedDialog from '@/playing/FinishedDialog';
import { toast } from '@/hooks/use-toast';
import PlayerCard from '@/playing/PlayerCard';
import RandomNumberEventDialog from '@/events/RandomNumberEventDialog';
import ShopCard from '@/playing/ShopCard';
import SpecialItemCard from '@/playing/SpecialItemCard';

const DEFAULT_ITEM: Omit<Item, 'owner'> = {
  id: '1',
  type: 'COIN',
  description: 'A coin that gives points to the player',
  duration: 0,
  name: 'Coin',
  coords: { x: 0, y: 0 },
  cooldown: 0,
};

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
  const [selectedItem, setSelectedItem] =
    useState<Omit<Item, 'owner'>>(DEFAULT_ITEM);
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

    const marked = gameState.items.some(
      (item) => item.coords.x === x && item.coords.y === y,
    );
    if (!marked) {
      setDialogOpened(true);
      setTarget({ x, y });
      return;
    }
    if (openedPopover.some((item) => item.x == x && item.y == y)) {
      setOpenedPopover((openedPopover) =>
        openedPopover.filter((item) => item.x !== x && item.y !== y),
      );
    } else {
      setOpenedPopover((openedPopover) => [...openedPopover, { x, y }]);
    }
  };

  const traps = gameState.items.reduce((traps, item) => {
    if (!traps[item.coords.x]) {
      traps[item.coords.x] = [];
    }
    traps[item.coords.x][item.coords.y] = item;
    return traps;
  }, [] as Item[][]);

  const getTileBackground = (row: number, col: number, map: number[][]) => {
    if (
      unityPlayer?.position &&
      Math.trunc(unityPlayer?.position?.x) === row &&
      Math.trunc(unityPlayer?.position?.y) === col
    ) {
      return 'purple';
    }
    if (
      gameState.items.some(
        (item) => item.coords.x === row && item.coords.y === col,
      )
    ) {
      return 'red';
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
                    <SheetHeader>
                      <SheetTitle>Manuel des sorts</SheetTitle>
                      <SheetDescription>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Voluptate, laborum.
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
                    {player.specialItems && player.specialItems.length > 0 && (
                      <>
                        <SheetHeader>
                          <SheetTitle>Items spéciaux</SheetTitle>
                          <SheetDescription>
                            Lorem ipsum dolor sit amet.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-2 mt-4">
                          {player.specialItems?.map((item) => (
                            <SpecialItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      </>
                    )}
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
            className={`grid gap-x-0`}
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
                      className="relative w-[1.15vw] h-[1.15vw] border border-border cursor-pointer"
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
                            row={map.length - 1 - row}
                            col={col}
                            onClose={() =>
                              handleClick(map.length - 1 - row, col)
                            }
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
                Lorem ipsum dolor sit amet consectetur.
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
                    <span>00:06</span>
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
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {players.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
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
            <DialogDescription>{selectedItem.description}</DialogDescription>
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {player?.items.map((item) => (
                        <>
                          <SelectItem
                            onClick={() => setSelectedItem(item)}
                            value={item.type}
                          >
                            {item.name}
                          </SelectItem>
                        </>
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
      {gameState.currentEvent?.type === 'RANDOM_NUMBER' && (
        <RandomNumberEventDialog event={gameState.currentEvent} />
      )}
    </>
  );
};

export default PlayingPage;
