export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export function parseXml(response: string): {
  title: string;
  type?: StepType;
  pending?: boolean;
  code?: string;
  path?: string;
}[] {
  if (!response || !response.includes('<boltArtifact')) {
    return [];
  }
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)(?=<\/boltArtifact>|$)/);
  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps = [];

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  steps.push({ title: artifactTitle });

  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    let [, type, filePath, content] = match;
    let i = 0;
    if (content[i] === '\n') {
      content = content.slice(1);
    }

    for (; i < content.length; i++) {
      if (content[i] !== ' ') {
        break;
      }
    }

    content = content
      .split('\n')
      .map(line => line.slice(i))
      .join('\n')

    if (type === 'file') {
      steps.push({
        title: `Create ${filePath || 'file'}`,
        type: StepType.CreateFile,
        pending: true,
        code: content.trimEnd(),
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        title: 'Run command',
        type: StepType.RunScript,
        pending: true,
        code: content.trimEnd(),
      });
    }
  }

  return steps;
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