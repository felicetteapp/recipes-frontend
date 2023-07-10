import { collection, doc, getDoc, } from "firebase/firestore";
import { db } from "../firebase";

const getUsersCollection = () =>  collection(db,'users');

export const getUserDoc = (userId:string)=>doc(getUsersCollection(),userId)

export const getUser = (userId:string) => getDoc(getUserDoc(userId));