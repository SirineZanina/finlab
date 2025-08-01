import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      try {
        // type safe RPC
        const response = await client.api.accounts.$get();

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch accounts: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);
        return responseData;
      } catch (error) {
        console.error('Query function error:', error);
        throw error;
      }
    }
  });

  return query;
};
