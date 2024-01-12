import { atom } from "jotai";
import { Column } from "../schema";

export const columnsAtom = atom<Column[]>([]);
