'use client';

import { useWebContainer } from "@/lib/hooks/webcontainer";
import { messageAtom } from "@/lib/stores/messageAtom";
import { selectedFileStore } from "@/lib/stores/selectedFile";
import { stepsAtom } from "@/lib/stores/stepsAtom";
import { StepType } from "@/lib/utils/constants";
import { useStore } from "@nanostores/react";
import { FileSystemTree } from "@webcontainer/api";
import { useEffect, useRef } from "react";

export const Preview = ({ className }: { className: string }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const selectedFile = useStore(selectedFileStore);
    const webContainer = useWebContainer();
    const stepStore = useStore(stepsAtom);

    useEffect(() => {
        const createFileSystemTree = (): FileSystemTree => {
            const localTree: FileSystemTree = {};
            for (const [path, { type, content }] of stepStore.entries()) {
                const isPending = messageAtom.get().map((m) => m.id === stepStore.get(path)?.id && m.steps.map(step => step.content === path && step.pending)).flat().includes(true);
                if (type === StepType.Script || !isPending) {
                    continue;
                }
                console.log(isPending, " - ", path);

                const parts = path.split("/")
                let current = localTree
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i]
                    if (i === parts.length - 1) {
                        current[part] = { file: { contents: content } }
                    } else {
                        if (!current[part]) {
                            current[part] = { directory: {} }
                        }
                        // @ts-ignore
                        // TODO: fix this
                        current = current[part].directory
                    }
                }
                messageAtom.set(messageAtom.get().map((m) => m.id === stepStore.get(path)?.id ? { ...m, steps: m.steps.map(step => step.content === path ? { ...step, pending: false } : step) } : m));
            }
            return localTree
        }

        async function load() {
            const mountStructure = createFileSystemTree();
            if (!webContainer || Object.keys(mountStructure).length === 0) {
                return;
            };
            console.log("mounting");
            await webContainer.mount(mountStructure);
            for (const [path, { type, content }] of stepStore.entries()) {
                const isPending = messageAtom.get().map((m) => m.id === stepStore.get(content)?.id && m.steps.map(step => step.content === path && step.pending)).flat().includes(true);
                console.log(isPending, " - ", path);
                if (type === StepType.Script && isPending) {
                    messageAtom.set(messageAtom.get().map((m) => m.id === stepStore.get(path)?.id ? { ...m, steps: m.steps.map(step => step.content === path ? { ...step, pending: false } : step) } : m));
                    for (const command of path.split("&&")) {
                        const cmd = command.split(" ");
                        const something = (await webContainer.spawn(cmd[0], cmd.slice(1)));
                        something.output.pipeTo(new WritableStream({
                            write(chunk) {
                                console.log(chunk.trim());
                            }
                        }));
                        await something.exit;
                    }
                }
            }
        }
        webContainer?.on('server-ready', (port, url) => {
            console.log('Server ready at', url, 'port', port);
            iframeRef.current?.setAttribute('src', url);
        });
        load();
    }, [stepStore, webContainer]);


    useEffect(() => {
        if (!webContainer || !selectedFile) {
            return;
        }
        webContainer.fs.writeFile(selectedFile, stepStore.get(selectedFile)?.content ?? "");
    }, [stepStore]);


    return (
        <iframe
            ref={iframeRef}
            className={`w-full h-full ${className}`}
        />
    );
}