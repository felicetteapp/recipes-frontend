import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getGroupDoc } from "./groups";
import type { IIngredient } from "../../interfaces/IIngredient";

const getIngredientsCollection = (groupId: string) =>
  collection(getGroupDoc(groupId), "ingredients");

export const deleteIngredient = async (
  groupId: string,
  ingredientId: string
) => {
  const thisCollection = getIngredientsCollection(groupId);
  const docRef = doc(thisCollection, ingredientId);
  await deleteDoc(docRef);
  return;
};

export const editOrCreateIngredient = async (
  groupId: string,
  { id, ...data }: Partial<IIngredient>
) => {
  const thisCollection = getIngredientsCollection(groupId);

  let docRef;
  if (id) {
    docRef = doc(thisCollection, id);
  } else {
    docRef = doc(thisCollection);
  }

  await setDoc(docRef, { ...data });

  return docRef;
};

export const queryIngredients = (groupId: string) => {
  return query(getIngredientsCollection(groupId), orderBy("name"));
};
