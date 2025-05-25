import {
  PropsWithChildren,
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Unsubscribe, User, getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../services/firebase";
import { useFetchUser } from "../hooks/useFetchUser";

const AuthContext = createContext<{ user: false | User; loading: boolean }>({
  user: false,
  loading: true,
});

const AuthContextProviderBase = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<false | User>(false);
  const [loading, setLoading] = useState(true);
  const listenerRef = useRef<Unsubscribe>(null);
  const [fetching, userOnDatabase, setUserUid] = useFetchUser();
  const userFetchedOnDatabaseMetadata = userOnDatabase?.metadataUpdated;

  useEffect(() => {
    if (user) {
      setLoading(true);
      user.getIdToken(true).then(() => {
        setLoading(false);
      });
    }
  }, [user, userFetchedOnDatabaseMetadata]);

  useEffect(() => {
    if (!user) {
      setUserUid(false);
    } else {
      setUserUid(user.uid);
    }
  }, [setUserUid, user]);

  useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current();
    }

    const auth = getAuth(firebaseApp);
    listenerRef.current = onAuthStateChanged(
      auth,
      async (stateUser) => {
        setLoading(true);
        if (stateUser) {
          setUser(stateUser);
        } else {
          setUser(false);
          setLoading(false);
        }
      },
      (error) => {
        //TODO: handling error
        console.log({ error });
      }
    );

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: loading || fetching }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextProvider = memo(AuthContextProviderBase);
export const useAuthContext = () => useContext(AuthContext);
