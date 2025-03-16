import { messageAtom, messageAtomType } from "../stores/messageAtom";
import { stepsAtom } from "../stores/stepsAtom";

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';

export enum StepType {
  File,
  Script
}

const ARTIFACT_TAG_OPEN = 'boltArtifact ';
const ARTIFACT_TAG_CLOSE = '</boltArtifact>';
const ARTIFACT_ACTION_TAG_OPEN = '<boltAction';
const ARTIFACT_ACTION_TAG_CLOSE = '</boltAction>';


export function parseXml(response: string, id: string, role: "system" | "user" | "assistant" | "data"): void {
  if (!response) return;

  const artifactStartIndex = response.indexOf(ARTIFACT_TAG_OPEN);
  let beforeArtifact = '';
  let artifactCandidate = '';

  if (artifactStartIndex !== -1) {
    if (response[artifactStartIndex - 1] === '<') {
      beforeArtifact = response.substring(0, artifactStartIndex - 1);
      artifactCandidate = response.substring(artifactStartIndex - 1 + ARTIFACT_TAG_OPEN.length);
    } else {
      beforeArtifact = response.substring(0, artifactStartIndex);
      artifactCandidate = response.substring(artifactStartIndex + ARTIFACT_TAG_OPEN.length);
    }
  } else {
    beforeArtifact = response;
  }

  const message: messageAtomType = {
    id,
    role,
    createdAt: new Date(),
    steps: [],
  };

  if (beforeArtifact) {
    message.steps.push({ content: beforeArtifact });
  }

  const actionRegex = new RegExp(
    `${ARTIFACT_ACTION_TAG_OPEN}\\s+type="([^"]*)"(?:\\s+filePath="([^"]*)")?>([\\s\\S]*?)${ARTIFACT_ACTION_TAG_CLOSE}`,
    'g'
  );

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = actionRegex.exec(artifactCandidate)) !== null) {
    lastIndex = actionRegex.lastIndex;
    let [, type, filePath, content] = match;

    if (content[0] === '\n') {
      content = content.slice(1);
    }

    let i = 0;
    for (; i < content.length; i++) {
      if (content[i] !== ' ') break;
    }

    content = content
      .split('\n')
      .map(line => line.slice(i))
      .join('\n');

    const step = new Map(stepsAtom.get());

    switch (type) {
      case 'file':
        step.set(filePath, {
          id,
          type: StepType.File,
          content: content.trimEnd(),
        });
        message.steps.push({
          type: StepType.File,
          pending: true,
          content: filePath,
        });
        break;
      case 'shell':
        step.set(content.trim(), {
          id,
          type: StepType.Script,
          content: content.trim(),
        });
        message.steps.push({
          type: StepType.Script,
          pending: true,
          content: content.trim(),
        });
        break;
    }
    stepsAtom.set(step);
  }

  const messageIndex = messageAtom.get()[messageAtom.get().length - 1]?.id === id;
  if (!messageIndex) {
    messageAtom.set([...messageAtom.get(), message]);
  } else {
    messageAtom.set([...messageAtom.get().slice(0, -1), message]);
  }
}


export const allowedHTMLElements = [
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'dd',
  'del',
  'details',
  'div',
  'dl',
  'dt',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'ins',
  'kbd',
  'li',
  'ol',
  'p',
  'pre',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'source',
  'span',
  'strike',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
  'var',
];