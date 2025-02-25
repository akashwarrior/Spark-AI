'use client';

import { useWebContainer } from "@/lib/hooks/webcontainer";
import { FileSystemTree } from "@webcontainer/api";
import { useEffect, useRef } from "react";

interface FileContent {
    name: string
    content: string
}

export const Preview = ({ message }: {
    message: {
        title: string;
        pending?: boolean;
        code?: string;
        path?: string;
    }[]
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const webContainer = useWebContainer();

    useEffect(() => {
        if (!webContainer) return;
        const files = message.reduce((acc: Array<string>, msg) => {
            if (msg?.path) acc.push(msg.path);
            return acc;
        }, []);

        const createFileSystemTree = (files: FileContent[]): FileSystemTree => {
            const tree: FileSystemTree = {}
            files.forEach((file) => {
                const parts = file.name.split("/")
                let current = tree
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i]
                    if (i === parts.length - 1) {
                        current[part] = { file: { contents: file.content } }
                    } else {
                        if (!current[part]) {
                            current[part] = { directory: {} }
                        }
                        current = current[part].directory
                    }
                }
            })
            return tree
        }

        async function load() {
            if (!webContainer) return;
            const mountStructure = createFileSystemTree(files.map(file => ({ name: file, content: message.find(msg => msg.path === file)?.code || '' })));
            console.log(mountStructure);
            await webContainer.mount(mountStructure);
            console.log("running npm install");
            const installProcess = await webContainer.spawn('npm', ['install']);
            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));
            const installProcess1 = await webContainer.spawn('npm', ['run', 'dev']);
            installProcess1.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));
        }
        webContainer.on('server-ready', (port, url) => {
            iframeRef.current?.setAttribute('src', url);
            console.log('Server ready at', url);
        });
        load();
    }, [message, webContainer]);


    return (
        <iframe
            ref={iframeRef}
            className="w-full h-full"
        />
    );
}