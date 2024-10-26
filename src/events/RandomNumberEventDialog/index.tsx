import { Event } from '@/api/event';
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
import { useRandomNumberForm } from '@/hooks/useRandomNumberForm';
import { convertElapsedTime } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Props {
  event?: Event;
}

const RandomNumberEventDialog = ({ event }: Props) => {
  const { form, handleSubmit, loading, submitted } = useRandomNumberForm();

  if (!event) {
    return null;
  }

  return (
    <Drawer open={true} dismissible={false}>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Un nouvel évènement !</DrawerTitle>
                <DrawerDescription>{event.description}</DrawerDescription>
              </DrawerHeader>
              <div className="text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {convertElapsedTime(event.timer)}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Temps restant
                </div>
              </div>
              <div className="mt-3 p-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input
                          {...field}
                          autoFocus
                          disabled={submitted}
                          placeholder="Saisissez un nombre entre 1 et 100"
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
                  disabled={!form.formState.isValid || loading || submitted}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Soumettre
                </Button>
              </DrawerFooter>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default RandomNumberEventDialog;
