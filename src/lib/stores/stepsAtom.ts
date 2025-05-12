import { atom } from 'nanostores';
import { StepType } from "../utils/constants";

interface Step {
    id: string
    type: StepType;
    content: string;
}
export const stepsAtom = atom<Map<string, Step>>(new Map());