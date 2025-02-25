import { UIMessage } from 'ai';
import { atom } from 'nanostores'

export const messageStore = atom<UIMessage[]>([]);