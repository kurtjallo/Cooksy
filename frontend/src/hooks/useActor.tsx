import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createMockActor, type Actor } from '@/backend';

type ActorContextValue = {
  actor: Actor | null;
  isFetching: boolean;
};

const ActorContext = createContext<ActorContextValue>({
  actor: null,
  isFetching: true,
});

export function ActorProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<Actor | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // In a real app, this is where Internet Identity/agent setup would live.
    setActor(createMockActor());
    setIsFetching(false);
  }, []);

  return (
    <ActorContext.Provider value={{ actor, isFetching }}>
      {children}
    </ActorContext.Provider>
  );
}

export function useActor() {
  return useContext(ActorContext);
}
