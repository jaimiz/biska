import { atom } from "jotai";
import { Column } from "./persisted/schema";

export const columnsAtom = atom<Column[]>([])
