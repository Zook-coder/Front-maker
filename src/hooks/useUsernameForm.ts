import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWebSocket } from '@/websockets/WebSocketProvider';

export const useUsernameForm = () => {
  const { socket, queries, setQueries } = useWebSocket();
  const FormSchema = z.object({
    username: z
      .string()
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
    socket?.emit(
      'signup',
      JSON.stringify({
        name: username,
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
