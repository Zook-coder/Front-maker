import { useWebSocket } from '@/websockets/WebSocketProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useItemForm = () => {
  const { socket, player } = useWebSocket();
  const FormSchema = z.object({
    item: z.string(),
  });
  const [target, setTarget] = useState<{ x: number; y: number }>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      item: 'COIN',
    },
  });

  const onSubmit = ({ item }: z.infer<typeof FormSchema>) => {
    socket?.emit(
      'cast:item',
      JSON.stringify({
        id: player?.id,
        x: target?.x,
        y: target?.y,
        item,
      }),
    );
  };

  return { form, onSubmit, setTarget };
};
