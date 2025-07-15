'use client';

import dynamic from 'next/dynamic';
import { createHighlighter } from 'shiki';
import type { BundledTheme, BundledLanguage } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import { useStore } from '@nanostores/react';
import { selectedFileStore } from '@/lib/stores/selectedFile';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const themes: BundledTheme[] = ['material-theme-darker', 'material-theme-lighter'];
const languages: BundledLanguage[] = ['js', 'ts', 'tsx', 'jsx', 'css', 'html', 'json', 'yaml', 'md', 'prisma'];

const CodeEditor = () => {
  const selectedFile = useStore(selectedFileStore);
  const lang = languages.includes(selectedFile?.split('.').pop() as BundledLanguage) ? selectedFile?.split('.').pop() : 'js';

  return (
    <Editor
      beforeMount={async (monaco) => {
        const highlighter = await createHighlighter({
          themes,
          langs: languages,
        });
        languages.forEach((lang) => monaco.languages.register({ id: lang }));
        shikiToMonaco(highlighter, monaco);
      }}
      height="100%"
      value={selectedFile}
      language={lang}
      theme={themes[0]}
      options={{
        minimap: { enabled: false },
        smoothScrolling: true,
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