import { createContext, useContext, type ReactNode } from 'react';
import { ActorProvider } from './useActor';

type IdentityContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const IdentityContext = createContext<IdentityContextValue>({
  isAuthenticated: true,
  isInitializing: false,
  login: async () => undefined,
  logout: async () => undefined,
});

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
  return (
    <IdentityContext.Provider
      value={{
        isAuthenticated: true,
        isInitializing: false,
        login: async () => undefined,
        logout: async () => undefined,
      }}
    >
      <ActorProvider>{children}</ActorProvider>
    </IdentityContext.Provider>
  );
}

export function useInternetIdentity() {
  return useContext(IdentityContext);
}
