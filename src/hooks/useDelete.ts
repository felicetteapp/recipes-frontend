import { useCallback, useState } from "react";

export function useDelete() {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  const handleDeletion = useCallback(async (callback: () => Promise<void>) => {
    setDeleting(true);
    await callback();
    setDeleted(true);
    setDeleting(false);
  }, []);

  return [deleting, handleDeletion, deleted] as [
    typeof deleting,
    typeof handleDeletion,
    typeof deleted
  ];
}
