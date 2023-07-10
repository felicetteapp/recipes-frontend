import { Timestamp, Unsubscribe, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUserDoc } from "../services/api/user";
import { IUserOnDatabase } from "../interfaces/IUserOnDatabase";

export function useFetchUser() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IUserOnDatabase | undefined>(undefined);
  const [userUid, setUserUid] = useState<string | false>(false);
  const listenerRef = useRef<Unsubscribe>();

  const docOrCollectionRef = useMemo(() => {
    if (!userUid) {
      return false;
    }

    return getUserDoc(userUid);
  }, [userUid]);

  useEffect(() => {
    setLoading(true);
    if (!docOrCollectionRef) {
      if (listenerRef.current) {
        listenerRef.current();
      }
      setLoading(false);
      return;
    }
    if (listenerRef.current) {
      listenerRef.current();
    }

    listenerRef.current = onSnapshot(docOrCollectionRef, (snapshot) => {
      const fetchedData = snapshot.data();

      if (!fetchedData) {
        setData(undefined);
      } else {
        const metadataUpdated =
          fetchedData.metadataUpdated instanceof Timestamp
            ? fetchedData.metadataUpdated.toMillis()
            : 0;
        setData({
          metadataUpdated,
          groups: fetchedData.groups,
        } as IUserOnDatabase);
      }

      setLoading(false);
    });

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, [docOrCollectionRef]);

  return [loading, data, setUserUid] as [
    typeof loading,
    typeof data,
    typeof setUserUid
  ];
}
