import { useWebSocket } from '@/websockets/WebSocketProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useBombPasswordForm = (id: string) => {
  const { socket, player } = useWebSocket();
  const [loading, setLoading] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const FormSchema = z.object({
    password: z.string({ message: 'Requis' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const submitReponse = async (password: string) => {
    return new Promise((resolve, reject) => {
      socket?.emit(
        'item:cancel',
        JSON.stringify({
          id: player?.id,
          itemId: id,
          password,
        }),
      );
      socket?.on('item:cancel:success', resolve);
      socket?.on('error', reject);
    });
  };

  const onSubmit = async ({ password }: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      await submitReponse(password);
    } catch {
      setLoading(false);
    }
    setLoading(false);
    setDrawerOpened(true);
  };

  return { form, onSubmit, loading, drawerOpened, setDrawerOpened };
};
