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
  const { socket } = useWebSocket();
  const [text, setText] = useState('');

  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Envoyer un message</CardTitle>
          <Input
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Envoyer un message"
          />
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique,
            praesentium?
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
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
    </div>
  );
}
