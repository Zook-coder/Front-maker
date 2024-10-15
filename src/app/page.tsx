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
import { useWebSocket } from '@/websockets/WebSocketProvider';

export default function Home() {
  const { socket } = useWebSocket();

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
        <CardContent></CardContent>
        <CardFooter>
          <Button>Envoyer</Button>
        </CardFooter>
      </Card>
      <Card></Card>
    </div>
  );
}
