import { useRef, useEffect } from 'react';

/**
 * Returns a ref that tracks whether the component is still mounted.
 * Use this to guard setState calls after async operations.
 *
 * @example
 * const isMounted = useMountedRef();
 * const fetchData = async () => {
 *   const result = await api.get('/data');
 *   if (isMounted.current) {
 *     setData(result.data);
 *   }
 * };
 */
export function useMountedRef(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

export default useMountedRef;
