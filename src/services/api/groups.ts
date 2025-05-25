import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { IGroup } from "../../interfaces/IGroup";

export const getGroupDoc = (groupId: string) => doc(db, "groups", groupId);

export const updateGroup = async (
  groupId: string,
  field: string,
  value: unknown,
  ...moreFieldsAndValues: unknown[]
) => {
  const docRef = getGroupDoc(groupId);
  await updateDoc(docRef, field, value, ...moreFieldsAndValues);
  return docRef;
};

export const createGroup = async ({
  creatorUid,
  name,
}: Pick<IGroup, "creatorUid" | "name">) => {
  return await addDoc(collection(db, "groups"), { creatorUid, name });
};

export const deleteGroup = async (groupId: string) => {
  await deleteDoc(getGroupDoc(groupId));
};
