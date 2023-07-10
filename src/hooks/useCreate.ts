import { DocumentReference } from "firebase/firestore";
import { useCallback, useState } from "react";

export function useCreate() {
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<DocumentReference>();

  const handleCreation = useCallback(
    async (callback: () => Promise<DocumentReference>) => {
      setCreating(true);
      const response = await callback();
      setCreated(response);
      setCreating(false);
    },
    []
  );

  return [creating, handleCreation, created] as [
    typeof creating,
    typeof handleCreation,
    typeof created
  ];
}
