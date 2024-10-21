'use client';
import { tilesColor } from '@/api/colors';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PlayingPage = () => {
  const { gameState, player } = useWebSocket();
  const [windowsSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();
  const [dialogOpened, setDialogOpened] = useState(false);

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

  const handleClick = () => {
    setDialogOpened(true);
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
                    <Card className="border-transparent shadow-none px-0">
                      <CardHeader className="px-0 py-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Sort 1</CardTitle>
                          <span className="text-muted-foreground">
                            {convertElapsedTime(gameState.timer)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Dégats</Badge>
                          <Badge variant="outline">Soin</Badge>
                        </div>
                      </CardHeader>
                      <CardDescription>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Consectetur, saepe!
                      </CardDescription>
                      <CardFooter className="px-0 py-4 flex justify-end">
                        <Button className="w-full">Envoyer</Button>
                      </CardFooter>
                    </Card>
                    <Separator className="my-2" />
                    <Card className="border-transparent shadow-none px-0">
                      <CardHeader className="px-0 py-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Sort 1</CardTitle>
                          <span className="text-muted-foreground">
                            {convertElapsedTime(gameState.timer)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Dégats</Badge>
                          <Badge variant="outline">Soin</Badge>
                        </div>
                      </CardHeader>
                      <CardDescription>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Consectetur, saepe!
                      </CardDescription>
                      <CardFooter className="px-0 py-4 flex justify-end">
                        <Button className="w-full">Envoyer</Button>
                      </CardFooter>
                    </Card>
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
            <div className={`grid grid-cols-95 grid-rows-41`}>
              {[...Array(gameState.map.length)].map((_, row) =>
                [...Array(gameState.map![row].length)].map((_, col) => (
                  <>
                    <div
                      key={`${row}-${col}`}
                      data-testID={`${row}-${col}`}
                      className="border border-border w-3 h-3 cursor-pointer"
                      style={{
                        background:
                          tilesColor[gameState.map![row][col]] ?? 'white',
                      }}
                      onClick={handleClick}
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="LA BETE EST LA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALHEUR">TENEBRES</SelectItem>
              <SelectItem value="MALHEUR">MALHEUR</SelectItem>
              <SelectItem value="SMOLDÉ">SMOLDÉ</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit" onClick={() => setDialogOpened(false)}>
              Piéger la case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayingPage;
