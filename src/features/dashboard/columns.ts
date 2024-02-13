import { Column } from "@/state/schema";
import { atom } from "jotai";

export const columnsAtom = atom<Column[]>([]);
