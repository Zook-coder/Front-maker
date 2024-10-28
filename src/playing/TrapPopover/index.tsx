import { Player } from '@/api/player';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useBombPasswordForm } from '@/hooks/useBombPasswordForm';
import { convertElapsedTime } from '@/lib/utils';
import { useWebSocket } from '@/websockets/WebSocketProvider';
import { Loader2, X } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  owner: Player;
  duration?: number;
  row: number;
  col: number;
  onClose: (x: number, y: number) => void;
  password?: string;
}

const TrapPopover = ({
  id,
  name,
  owner,
  duration,
  row,
  col,
  onClose,
  password,
}: Props) => {
  const { socket, player } = useWebSocket();
  const { form, onSubmit, loading, drawerOpened, setDrawerOpened } =
    useBombPasswordForm(id);

  return (
    <>
      <div className="px-4 py-2 pt-5 absolute -top-full left-1/2 -translate-x-1/2 -translate-y-full z-50 min-w-52 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="relative">
          <X
            data-testid={`close-trappopover`}
            className="text-muted-foreground w-4 h-4 absolute -top-3 -left-1 z-[99]"
            onClick={() => onClose(row, col)}
          />
          <div className="py-1 flex items-center justify-between">
            <h4 className="text-sm font-semibold leading-none tracking-tight">
              Case piégée
            </h4>
            <span className="text-sm text-muted-foreground">
              {duration ? convertElapsedTime(duration) : 'Infini'}
            </span>
          </div>
          <Separator className="my-2" />
          <div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posé par</span>
                <span className="text-xs font-medium">
                  {owner ? owner.name : 'Système'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Piège</span>
                <span className="text-xs font-medium">{name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Coordonnées
                </span>
                <span className="text-xs font-medium">{`(${row},${col})`}</span>
              </div>
              <Button
                className="h-6 w-full z-[99]"
                size="sm"
                onClick={() => {
                  if (name === 'Bomb') {
                    setDrawerOpened(true);
                    return;
                  } else {
                    socket?.emit(
                      'item:cancel',
                      JSON.stringify({
                        itemId: id,
                        id: player?.id,
                        row,
                        col,
                      }),
                    );
                  }
                }}
              >
                Annuler le piège
              </Button>
            </div>
          </div>
          <div className="bg-card w-4 h-4 absolute -bottom-4 left-1/2 -translate-x-1/2 rotate-45"></div>
        </div>
      </div>
      {drawerOpened && (
        <Drawer open={true}>
          <DrawerContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Désormaçage de la bombe</DrawerTitle>
                    <DrawerDescription>
                      Le mot de passe est : {password}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="mt-3 p-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <>
                          <FormControl>
                            <Input
                              {...field}
                              autoFocus
                              type="text"
                              placeholder="Veuillez saisir le mot de passe."
                            />
                          </FormControl>
                          <FormMessage className="mt-2" />
                        </>
                      )}
                    />
                  </div>
                  <DrawerFooter>
                    <Button
                      type="submit"
                      disabled={!form.formState.isValid || loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Soumettre
                    </Button>
                  </DrawerFooter>
                </div>
              </form>
            </Form>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default TrapPopover;
