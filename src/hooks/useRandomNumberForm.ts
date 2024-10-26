import { useWebSocket } from '@/websockets/WebSocketProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useRandomNumberForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { socket, player } = useWebSocket();
  const FormSchema = z.object({
    number: z.coerce
      .number({ message: 'Veuillez renseigner un nombre' })
      .positive({ message: 'Le nombre doit être positif' })
      .max(100, { message: 'Le nombre doit ne peut pas dépasser 100' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const submitReponse = async (number: number) => {
    return new Promise((resolve, reject) => {
      socket?.emit(
        'event:submit',
        JSON.stringify({
          id: player?.id,
          response: number,
        }),
      );
      socket?.on('event:submit:success', resolve);
      socket?.on('error', reject);
    });
  };

  const handleSubmit = async ({ number }: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      await submitReponse(number);
      setSubmitted(true);
    } catch {
      setLoading(false);
    }
    setLoading(false);
  };

  return { form, handleSubmit, loading, submitted };
};
