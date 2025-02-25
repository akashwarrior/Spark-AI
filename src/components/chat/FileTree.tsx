import { selectedFileStore } from "@/lib/stores/selectedFile";
import { Folder, File } from "lucide-react"
import { useEffect } from "react";

export function FileTree({ files }: { files: string[] }) {
    const sortedFiles = [...files].sort((a, b) => {
        const aDepth = a.split("/").length
        const bDepth = b.split("/").length
        if (aDepth !== bDepth) return bDepth - aDepth;
        return a.localeCompare(b);
    });

    useEffect(() => {
        selectedFileStore.set(files[files.length - 1]);
    }, [files])

    const renderFileTree = (files: string[], path = "") => {
        const items = new Map<string, string[]>();

        files.forEach((file) => {
            const parts = file.split("/");
            if (parts.length === 1) {
                items.set(parts[0], []);
            } else {
                const dir = parts[0];
                const rest = parts.slice(1).join("/");
                if (!items.has(dir)) {
                    items.set(dir, [rest]);
                }
                items.get(dir)?.push(rest);
            }
        })

        return (
            <ul className="space-y-2">
                {Array.from(items).map(([name, children]) => (
                    <li key={name}>
                        {children.length > 0 ? (
                            <div>
                                <div className="flex items-center">
                                    <Folder className="w-4 h-4 mr-2" />
                                    <span>{name}</span>
                                </div>
                                <div className="pl-4 mt-2">{renderFileTree(children, `${path}${name}/`)}</div>
                            </div>
                        ) : (
                            <div
                                className="flex items-center cursor-pointer hover:bg-secondary/50 p-1 rounded"
                                onClick={() => selectedFileStore.set(path + name)}
                            >
                                <File className="w-4 h-4 mr-2" />
                                <span>{name}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="p-4 h-full overflow-auto">
            <h2 className="text-sm font-semibold mb-2">Project Files</h2>
            {renderFileTree(sortedFiles)}
        </div>
    )
}