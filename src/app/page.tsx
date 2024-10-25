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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUsernameForm } from '@/hooks/useUsernameForm';
import StartingDialog from '@/lobby/StartingDialog';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Lobby() {
  const { socket, players, player, gameState, queries, setQueries } =
    useWebSocket();
  const { form, onSubmit } = useUsernameForm();

  useEffect(() => {
    if (gameState.status === 'PLAYING') {
      redirect('/playing');
    }
  }, [gameState]);

  return (
    <>
      <div className="relative flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Choisir votre pseudo</CardTitle>
            <CardDescription>
              Ce pseudo fera office de nom {"d'affichage"} lors de la partie.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={player?.name ?? "Boucle d'or"}
                          disabled={players.some(
                            (item) => item.id === player?.id,
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    players.some((item) => item.id === player?.id) ||
                    queries.signup.loading
                  }
                >
                  {queries.signup.loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Envoyer
                </Button>
                {players.some((item) => item.name === player?.name) && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      socket?.emit(
                        'logout',
                        JSON.stringify({
                          id: player?.id,
                        }),
                      );
                    }}
                  >
                    Quitter
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
        <Card className="absolute right-0 h-full flex flex-col justify-between">
          <div className={`${players.length === 0 && 'pr-16'}`}>
            <CardHeader>
              <CardTitle>Joueur connectés</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {players.map((player) => (
                  <Card
                    key={player.id}
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
                    <Button
                      className={`h-8 ${player.type === 'WEB' ? 'text-muted-foreground' : ''}`}
                      variant={player.type == 'UNITY' ? 'default' : 'outline'}
                    >
                      {player.type.charAt(0) +
                        player.type.slice(1).toLowerCase()}
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </div>
          <CardFooter className="w-full">
            <Button
              disabled={queries.start.loading}
              onClick={() => {
                socket?.emit(
                  'start',
                  JSON.stringify({
                    id: player?.id,
                  }),
                );
                setQueries({
                  ...queries,
                  start: {
                    loading: true,
                  },
                });
              }}
              className="w-full"
            >
              {queries.start.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lancer la partie
            </Button>
          </CardFooter>
        </Card>
      </div>
      <StartingDialog />
    </>
  );
}
