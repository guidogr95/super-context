import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  useMemo,
} from "react";

type SetActionArg<A> = Partial<A> | ((prevState: A) => A)

type SetAction<T> = (value: SetActionArg<T>) => void

type SetterFunctions<L extends Record<string, unknown>> = {
  [K in keyof L as K extends string ? `set${Capitalize<K>}` : never]: (
    value: L[K] | ((prevState: L[K]) => L[K]),
  ) => void
}

export function createSuperContext<Store extends Record<string, unknown>>(initialState: Store) {
  function useStoreData(): {
    get: () => Store
    set: SetAction<Store>
    subscribe: (callback: () => void) => () => void
    setters: SetterFunctions<Store>
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const handleUpdateSubscribers = () => {
      subscribers.current.forEach((callback) => callback());
    };

    const set = useCallback((...args: [SetActionArg<Store>]) => {
      const [value] = args;
      store.current =
        typeof value === "function"
          ? { ...store.current, ...value(store.current) }
          : { ...store.current, ...value };

      handleUpdateSubscribers();
    }, []);

    const createSetters = useCallback(
      <L extends Record<string, unknown>>(obj: L): SetterFunctions<L> => {
        const setters = {} as SetterFunctions<L>;

        for (const key in obj) {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          const setterKey = `set${capitalizedKey}` as keyof SetterFunctions<L>;
          setters[setterKey] = ((value: L[keyof L]) => {
            store.current = {
              ...store.current,
              [key]: typeof value === "function" ? value(store.current[key]) : value,
            };

            handleUpdateSubscribers();
          }) as SetterFunctions<L>[keyof SetterFunctions<L>];
        }

        return setters as SetterFunctions<L>;
      },
      [],
    );

    const setters = useMemo(() => createSetters(store.current), [createSetters]);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
      setters,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput,
  ): [SelectorOutput, SetAction<Store>, SetterFunctions<Store>] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState),
    );

    return [state, store.set, store.setters];
  }

  return {
    Provider,
    useStore,
  };
}
