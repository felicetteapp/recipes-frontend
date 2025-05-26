import { createContext, memo, useCallback, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { GroupRegisterPage } from "../components/GroupRegisterPage";
import { FullScreenSpinner } from "../components/FullScreenSpinner";
import type { IGroup } from "../interfaces/IGroup";
import { getGroupDoc } from "../services/api/groups";
import { getDoc } from "firebase/firestore";

type AvailableGroup = Pick<IGroup, "name" | "creatorUid" | "id">;

type contextValue = {
  id: null | false | string;
  availableGroups: Array<AvailableGroup>;
  currentGroup: AvailableGroup | undefined;
  changeGroup: (newGroupId: string) => void;
  updateGroupsData: () => void;
};

const initialValue: contextValue = {
  id: false,
  availableGroups: [],
  currentGroup: undefined,
  changeGroup: () => {},
  updateGroupsData: () => {},
};

const getAvailableGroups = async (groupIds: Array<string>) => {
  const promises = groupIds.map(async (groupId) => {
    const snapshot = await getDoc(getGroupDoc(groupId));
    if (snapshot.exists()) {
      const { name, creatorUid } = snapshot.data();

      return { name, creatorUid, id: snapshot.id };
    }
  });

  const resolvedPromises = await Promise.all(promises);
  const groupsWithData = resolvedPromises.filter(
    Boolean
  ) as Array<AvailableGroup>;

  return groupsWithData;
};

export const GroupContext = createContext<contextValue>(initialValue);
const GroupContextProviderBase = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [groupId, setGroupId] = useState<string | false | null>(
    initialValue.id
  );
  const [processing, setProcessing] = useState(true);
  const [claimsFetched, setClaimsFetched] = useState(false);
  const { user, loading } = useAuthContext();
  const [updatedGroupId, setUpdatedGroupId] = useState<string | false | null>(
    false
  );

  const [currentGroupsClaims, setCurrentGroupsClaims] = useState<Array<string>>(
    []
  );

  const [availableGroups, setAvailableGroups] = useState<Array<AvailableGroup>>(
    []
  );

  const updateGroupsData = useCallback(() => {
    getAvailableGroups(currentGroupsClaims).then(setAvailableGroups);
  }, [currentGroupsClaims]);

  useEffect(() => {
    updateGroupsData();
  }, [updateGroupsData]);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((token) => {
        const groups = (token.claims.groups as string[] | undefined) || [];
        setCurrentGroupsClaims(groups);
        setClaimsFetched(true);
      });
    }
  }, [user]);

  useEffect(() => {
    setProcessing(true);
    if (!currentGroupsClaims.length) {
      setGroupId(user ? null : false);
    } else {
      setGroupId((currentId) => {
        if (currentId && currentGroupsClaims.includes(currentId)) {
          return currentId;
        }
        return currentGroupsClaims[0];
      });
    }
    setProcessing(false);
  }, [currentGroupsClaims, user]);

  useEffect(() => {
    setUpdatedGroupId(groupId);
  }, [groupId]);

  return (
    <GroupContext.Provider
      value={{
        id: groupId,
        availableGroups,
        currentGroup: availableGroups.find(({ id }) => id === groupId),
        changeGroup: setGroupId,
        updateGroupsData,
      }}
    >
      {loading ||
      processing ||
      !claimsFetched ||
      !user ||
      groupId !== updatedGroupId ? (
        <FullScreenSpinner />
      ) : updatedGroupId === null ? (
        <GroupRegisterPage />
      ) : (
        children
      )}
    </GroupContext.Provider>
  );
};

export const GroupContextProvider = memo(GroupContextProviderBase);
