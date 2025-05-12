import { atom } from 'nanostores'
import { StepType } from '../utils/constants';

export interface messageAtomType {
    id: string;
    role: "system" | "user" | "assistant" | "data";
    steps: {
        type?: StepType;
        pending?: boolean;
        content: string;
    }[];
    createdAt: Date;
}

export const messageAtom = atom<messageAtomType[]>([])