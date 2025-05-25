import { DocumentReference, Unsubscribe, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export function useFetch<T>(docOrCollectionRef: DocumentReference) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();
  const listenerRef = useRef<Unsubscribe>(null);

  useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current();
    }
    setLoading(true);
    listenerRef.current = onSnapshot(docOrCollectionRef, (snapshot) => {
      const snapshotdata = snapshot.data();

      setData({ id: snapshot.id, ...snapshotdata } as T);
      setLoading(false);
    });
  }, [docOrCollectionRef]);

  return [loading, data] as [typeof loading, typeof data];
}
