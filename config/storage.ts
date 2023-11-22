import { getStorage } from "firebase/storage";
import { firebaseApp } from "./firebase";

export const storageFB = getStorage(firebaseApp)