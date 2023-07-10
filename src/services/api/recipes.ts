import { collection, deleteDoc, doc, orderBy, query, setDoc } from "firebase/firestore";
import { getGroupDoc } from "./groups";
import { IRecipe } from "../../interfaces/IRecipe";

const getRecipesCollection = (groupId: string) =>
  collection(getGroupDoc(groupId), "recipes");

export const editOrCreateRecipe = async (
  groupId: string,
  { id, ...data }: Partial<IRecipe>
) => {
  const thisCollection = getRecipesCollection(groupId);

  let docRef;
  if (id) {
    docRef = doc(thisCollection, id);
  } else {
    docRef = doc(thisCollection);
  }

  await setDoc(docRef, { ...data });

  return docRef;
};

export const deleteRecipe = async (groupId: string, ingredientId: string) => {
  const thisCollection = getRecipesCollection(groupId);
  const docRef = doc(thisCollection, ingredientId);
  await deleteDoc(docRef);
  return;
};


export const queryRecipes = (groupId:string) =>{
  return query(getRecipesCollection(groupId), orderBy("name"));
}