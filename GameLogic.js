// This file will hold all of the game logic used for whatever game we decide to make.
// TODO Game type suggestions: Frogger, Card Game (Poker, Hearts, Spades, etc), 2D Scroller (Raptor, Galaga, etc)

// Example of defining a functional constant, this will be helpful when we need to pass parameters
const someFunction = (params) => {
  params = "We can pass params and manipulate in the function";
  console.log(params);
};

// #region HOOKS

const useState = (initialValue) => {
  let state = initialValue;
  const setState = (newValue) => {
    state = newValue;
  };
  return [state, setState];
};

const useEffect = (callback, dependencies) => {
  const previousDependencies = useRef(dependencies);

  useEffect(() => {
    const hasChanged = previousDependencies.current.some(
      (dependency, index) => dependency !== dependencies[index]
    );

    if (hasChanged) {
      callback();
    }

    previousDependencies.current = dependencies;
  }, dependencies);
};

const useCallback = (callback, dependencies) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useMemo(() => {
    return (...args) => {
      return ref.current.apply(null, args);
    };
  }, dependencies);
};

const useRef = (initialValue) => {
  const ref = { current: initialValue };
  return ref;
};

const useMemo = (callback, dependencies) => {
  const cache = useRef({});
  const dependenciesChanged = dependencies.some(
    (dependency, index) => dependency !== cache.current[index]
  );
  if (dependenciesChanged) {
    cache.current = dependencies;
    cache.value = callback();
  }
  return cache.value;
};

// #endregion
