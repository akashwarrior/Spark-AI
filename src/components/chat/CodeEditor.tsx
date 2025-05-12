'use client';

import { type BundledTheme, createHighlighter, BundledLanguage } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import { useStore } from '@nanostores/react';
import { selectedFileStore } from '@/lib/stores/selectedFile';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { stepsAtom } from '@/lib/stores/stepsAtom';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const themes: BundledTheme[] = ['material-theme-darker', 'material-theme-lighter'];
const languages: BundledLanguage[] = ['js', 'ts', 'tsx', 'jsx', 'css', 'html', 'json', 'yaml', 'md', 'prisma'];

const CodeEditor = () => {
  const { theme } = useTheme();
  const selectedFile = useStore(selectedFileStore);
  const codeFile = useStore(stepsAtom);
  const lang = languages.includes(selectedFile?.split('.').pop() as BundledLanguage) ? selectedFile?.split('.').pop() : 'js';

  return (
    <MonacoEditor
      beforeMount={async (monaco) => {
        const highlighter = await createHighlighter({
          themes,
          langs: languages,
        });
        languages.forEach((lang) => monaco.languages.register({ id: lang }));
        shikiToMonaco(highlighter, monaco);
      }}
      height="100%"
      value={codeFile.get(selectedFile)?.content}
      language={lang}
      theme={theme === 'dark' ? themes[0] : themes[1]}
      onChange={(value) => {
        const map = new Map(stepsAtom.get());
        map.set(selectedFile, { ...map.get(selectedFile)!, content: value ?? "" });
        stepsAtom.set(map);
      }}
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