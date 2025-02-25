import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import dynamic from 'next/dynamic';
import { useStore } from '@nanostores/react';
import { selectedFileStore } from '@/lib/stores/selectedFile';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const CodeEditor = ({ message }: { message: any }) => {
  const selectedFile = useStore(selectedFileStore);
  const code = message?.find((msg: any) => msg?.path === selectedFile)?.code ?? "";
  const lang = selectedFile?.split('.').pop() ?? 'plaintext';
  return (
    <MonacoEditor
      onMount={async (_editor, monaco) => {
        const highlighter = await createHighlighter({
          themes: ['material-theme-darker'],
          langs: ['html', 'css', 'javascript', 'typescript', 'jsx', 'tsx', 'json', 'dotenv', 'shell', 'bash', 'yaml', 'yml', 'markdown', 'graphql', 'sql', 'python', 'rust', 'go', 'java', 'js', 'ts']
        });
        monaco.languages.register({ id: 'html' });
        monaco.languages.register({ id: 'css' });
        monaco.languages.register({ id: 'javascript' });
        monaco.languages.register({ id: 'typescript' });
        monaco.languages.register({ id: 'jsx' });
        monaco.languages.register({ id: 'tsx' });
        monaco.languages.register({ id: 'json' });
        monaco.languages.register({ id: 'dotenv' });
        monaco.languages.register({ id: 'shell' });
        monaco.languages.register({ id: 'bash' });
        monaco.languages.register({ id: 'yaml' });
        monaco.languages.register({ id: 'yml' });
        monaco.languages.register({ id: 'markdown' });
        monaco.languages.register({ id: 'java' });
        monaco.languages.register({ id: 'graphql' });
        monaco.languages.register({ id: 'sql' });
        monaco.languages.register({ id: 'python' });
        monaco.languages.register({ id: 'rust' });
        monaco.languages.register({ id: 'go' });
        monaco.languages.register({ id: 'js' });
        monaco.languages.register({ id: 'ts' });

        shikiToMonaco(highlighter, monaco);
      }}
      height="100%"
      value={code}
      language={lang}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        detectIndentation: true,
        tabSize: 2,
      }}
    />
  )
};

export default CodeEditor;