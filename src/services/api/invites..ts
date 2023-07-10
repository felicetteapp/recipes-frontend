import {
  collection,
  deleteDoc,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, functions } from "../firebase";
import { IInvite } from "../../interfaces/IInvite";
import { httpsCallable } from "firebase/functions";

const getInvitesCollection = () => collection(db, "invites");

export const queryInvites = <To, GroupId>({
  groupId,
  to,
}: To extends string
  ? { to: To; groupId?: never }
  : GroupId extends string
  ? { groupId: GroupId; to?: never }
  : never) => {
  const collection = getInvitesCollection();

  return query(
    collection,
    groupId ? where("groupId", "==", groupId) : where("to", "==", to)
  );
};

export const createInvite = async ({ groupId, to, from }: IInvite) => {
  const docRef = doc(getInvitesCollection());
  await setDoc(docRef, { groupId, to, from });
  return docRef;
};

export const deleteInvite = async (id: string) => {
  const docRef = doc(getInvitesCollection(), id);
  return deleteDoc(docRef);
};

export const acceptInvite = async (id: string) => {
  const apiCall = httpsCallable<{ inviteId: string }, void>(
    functions,
    "acceptInvite"
  );
  return apiCall({ inviteId: id });
};
