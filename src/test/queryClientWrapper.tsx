import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { createQueryClient } from '@/config/queryClient';

export const createQueryClientWrapper = () => {
  const queryClient = createQueryClient('test');

  const QueryClientWrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  QueryClientWrapper.displayName = 'QueryClientWrapper';

  return QueryClientWrapper;
};
