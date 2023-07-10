import { Query, Unsubscribe, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export function useFetchQuery<T>(docOrCollectionRef?: Query) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<T>>([]);
  const listenerRef = useRef<Unsubscribe>();

  useEffect(() => {
    if (!docOrCollectionRef) {
      return;
    }
    if (listenerRef.current) {
      listenerRef.current();
    }
    setLoading(true);
    listenerRef.current = onSnapshot(docOrCollectionRef, (snapshot) => {
      const fetchedDocs = snapshot.docs.map((thisSnapDoc) => {
        return {
          id: thisSnapDoc.id,
          ...thisSnapDoc.data(),
        } as T;
      });

      setData(fetchedDocs);
      setLoading(false);
    });

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, [docOrCollectionRef]);

  return [loading, data] as [typeof loading, typeof data];
}
