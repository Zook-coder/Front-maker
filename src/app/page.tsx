'use client';
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
  const { socket, gameState } = useWebSocket();
  const [text, setText] = useState('');

  const convertElapsedTime = (seconds: number) => {
    seconds = Math.trunc(seconds);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Envoyer un message</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique,
            praesentium?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Envoyer un message"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              socket?.send(text);
            }}
          >
            Envoyer
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Temps de jeu</CardTitle>
        </CardHeader>
        <CardContent>{convertElapsedTime(gameState.timer)}</CardContent>
      </Card>
    </div>
  );
}
