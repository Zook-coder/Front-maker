import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWebSocket } from '@/websockets/WebSocketProvider';

export const useUsernameForm = () => {
  const { socket, queries, setQueries, players, player } = useWebSocket();
  const FormSchema = z.object({
    username: z
      .string({
        message: 'Requis',
      })
      .min(2, {
        message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
      })
      .max(20, {
        message: "Le nom d'utilisateur ne peut pas dépasser 20 caractères.",
      })
      .refine((username) => username.trim().length > 0, {
        message: "Le nom d'utilisateur a un format invalide",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = ({ username }: z.infer<typeof FormSchema>) => {
    if (players.some((item) => item.name === player?.name)) {
      return;
    }
    socket?.emit(
      'signup',
      JSON.stringify({
        name: username.trim(),
        type: 'WEB',
      }),
    );
    setQueries({
      ...queries,
      signup: {
        loading: true,
      },
    });
  };

  return { form, onSubmit };
};
