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
import { convertElapsedTime } from '@/lib/utils';
import SpellCard from '@/playing/SpellCard';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useItemForm } from '@/hooks/useItemForm';
import { Form, FormControl, FormField } from '@/components/ui/form';

const PlayingPage = () => {
  const { gameState, player } = useWebSocket();
  const { onSubmit, form, setTarget } = useItemForm();
  const [windowsSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<{
    row: number;
    col: number;
  }>();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameState.status !== 'PLAYING') {
      redirect('/');
    }
  }, [gameState]);

  const handleClick = (x: number, y: number) => {
    setDialogOpened(true);
    setTarget({ x, y });
  };

  return (
    <>
      <header className="flex items-center py-2 px-10 justify-between border-b">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {player?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{player?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {player?.role}
            </span>
          </div>
        </div>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Lancer un sort</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Manuel des sorts</SheetTitle>
                    <SheetDescription>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Voluptate, laborum.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col mt-4">
                    <SpellCard id={1} name="Sort 1" description="" />
                    <Separator className="my-2" />
                    <SpellCard id={1} name="Sort 2" description="" />
                    <Separator className="my-2" />
                    <SpellCard id={1} name="Sort 3" description="" />
                  </div>
                </SheetContent>
              </Sheet>
            </li>
            <li>
              <Button variant="outline" size="icon">
                <LayoutDashboard className="text-muted-foreground" />
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex justify-between px-10">
        {windowsSize && gameState && gameState.map && (
          <>
            <div className={`grid grid-cols-95 grid-rows-41 gap-x-0`}>
              {[...Array(gameState.map.length)].map((_, row) =>
                [...Array(gameState.map![row].length)].map((_, col) => (
                  <>
                    <div
                      key={`${row}-${col}`}
                      data-testid={`${row}-${col}`}
                      className="w-3 h-3 border border-border cursor-pointer"
                      onMouseMove={() => setHoveredPosition({ row, col })}
                      style={{
                        background:
                          hoveredPosition?.col === col &&
                          hoveredPosition.row === row
                            ? 'black'
                            : (tilesColor[gameState.map![row][col]] ?? 'white'),
                      }}
                      onClick={() => handleClick(row, col)}
                    />
                  </>
                )),
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Card>
                <CardHeader>
                  <CardTitle>Statut de jeu</CardTitle>
                  <CardDescription>
                    Lorem ipsum dolor sit amet consectetur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <ul>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Temps de jeu
                        </span>
                        <span>{convertElapsedTime(gameState.timer)}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Nombre de boucles
                        </span>
                        <span>{gameState.loops}</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques globales</CardTitle>
                  <CardDescription>
                    Lorem ipsum dolor sit amet consectetur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="text-base font-semibold">Bienfaiteur</span>
                    <div className="flex flex-col">
                      <ul>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Bonus utilisés
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Nombre de boucles
                          </span>
                          <span>{gameState.loops}</span>
                        </li>
                      </ul>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  <div>
                    <span className="text-base font-semibold">Malfaiteur</span>
                    <div className="flex flex-col">
                      <ul>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Bonus utilisés
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Nombre de boucles
                          </span>
                          <span>{gameState.loops}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <Dialog
        open={dialogOpened}
        onOpenChange={() => setDialogOpened(!dialogOpened)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tu {"l'"}entends ce bruit ?</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem,
              nobis.
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TENEBRES">TENEBRES</SelectItem>
                      <SelectItem value="MALHEUR">MALHEUR</SelectItem>
                      <SelectItem value="SMOLDÉ">SMOLDÉ</SelectItem>
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
    </>
  );
};

export default PlayingPage;
