import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BefeniProvider } from '../contexts/befeniContext';

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}>
    <BefeniProvider>
      <Component {...pageProps} />
    </BefeniProvider>
  </QueryClientProvider>
}

export default MyApp
