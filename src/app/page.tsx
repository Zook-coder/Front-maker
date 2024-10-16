'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { useState } from 'react';

export default function Home() {
  const { socket, players } = useWebSocket();
  const [username, setUsername] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const convertElapsedTime = (seconds: number) => {
    seconds = Math.trunc(seconds);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Choisir votre pseudo</CardTitle>
          <CardDescription>
            Ce pseudo fera office de nom {"d'affichage"} lors de la partie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Boucle d'or"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              socket?.emit(
                'signup',
                JSON.stringify({
                  name: username,
                  type: 'WEB',
                }),
              );
            }}
          >
            Envoyer
          </Button>
        </CardFooter>
      </Card>
      <Card className="absolute right-0 h-full pr-0">
        <CardHeader>
          <CardTitle>Joueur connectés</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {players.map((player) => (
              <Card
                key={player.name}
                className="w-full flex items-center gap-12 border-none border-transparent shadow-none"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {player.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardContent className="p-0">
                    <span className="font-medium leading-none tracking-tight">
                      {player.name}
                    </span>
                    <CardDescription>Lorem, ipsum dolor.</CardDescription>
                  </CardContent>
                </div>
                <Button className="h-8">Vous</Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
