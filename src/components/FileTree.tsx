'use client';

import { selectedFileStore } from "@/lib/stores/selectedFile";
import { StepType } from "@/lib/utils/constants";
import { useStore } from "@nanostores/react";
import {
    Folder,
    FolderOpen,
    File,
    ChevronRight,
    ChevronDown,
    FileText,
    FileCode,
    Image,
    FileJson,
    FileType,
    FolderPlus
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'vue':
        case 'svelte':
            return FileCode;
        case 'json':
        case 'jsonc':
            return FileJson;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'gif':
        case 'webp':
            return Image;
        case 'md':
        case 'mdx':
        case 'txt':
            return FileText;
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            return FileType;
        default:
            return File;
    }
};

const getFileColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
            return 'text-yellow-400';
        case 'ts':
        case 'tsx':
            return 'text-blue-400';
        case 'vue':
            return 'text-green-400';
        case 'svelte':
            return 'text-orange-400';
        case 'json':
        case 'jsonc':
            return 'text-yellow-300';
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            return 'text-blue-300';
        case 'md':
        case 'mdx':
            return 'text-gray-300';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'gif':
        case 'webp':
            return 'text-purple-400';
        default:
            return 'text-muted-foreground';
    }
};

export function FileTree() {
    const files = new Map<string, {
        id: string
        type: StepType
        content: string
    }>();
    const selectedFile = useStore(selectedFileStore);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const sortedFiles = files.entries().toArray()
        .filter(file => file[1].type === StepType.File)
        .map((file) => file[0])
        .sort((a, b) => {
            const aDepth = a.split("/").length;
            const bDepth = b.split("/").length;
            if (aDepth !== bDepth) return aDepth - bDepth;
            return a.localeCompare(b);
        });

    useEffect(() => {
        if (selectedFileStore.get() === "" && sortedFiles.length > 0) {
            selectedFileStore.set(sortedFiles[0]);
        }
    }, [files, sortedFiles.length])

    const toggleFolder = (folderPath: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderPath)) {
            newExpanded.delete(folderPath);
        } else {
            newExpanded.add(folderPath);
        }
        setExpandedFolders(newExpanded);
    };

    const renderFileTree = (files: string[], path = "", level = 0) => {
        const items = new Map<string, string[]>();

        files.forEach((file) => {
            const parts = file.split("/");
            if (parts.length === 1) {
                items.set(parts[0], []);
            } else {
                const dir = parts[0];
                const rest = parts.slice(1).join("/");
                if (!items.has(dir)) {
                    items.set(dir, []);
                }
                items.get(dir)?.push(rest);
            }
        })

        return (
            <ul className="space-y-0.5">
                {Array.from(items).map(([name, children]) => {
                    const fullPath = path + name;
                    const isFolder = children.length > 0;
                    const isExpanded = expandedFolders.has(fullPath);
                    const isSelected = selectedFile === fullPath;
                    const isHovered = hoveredItem === fullPath;

                    return (
                        <li key={name} className="">
                            {isFolder ? (
                                <div>
                                    <div
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group",
                                            isHovered && "bg-white/10 backdrop-blur-sm scale-[1.02]",
                                            "hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02]"
                                        )}
                                        onClick={() => toggleFolder(fullPath)}
                                        onMouseEnter={() => setHoveredItem(fullPath)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                                    >
                                        <div className="flex items-center gap-1">
                                            {isExpanded ? (
                                                <ChevronDown className={cn(
                                                    "w-3 h-3 transition-all duration-200",
                                                    isHovered ? "text-foreground" : "text-muted-foreground"
                                                )} />
                                            ) : (
                                                <ChevronRight className={cn(
                                                    "w-3 h-3 transition-all duration-200",
                                                    isHovered ? "text-foreground" : "text-muted-foreground"
                                                )} />
                                            )}
                                            {isExpanded ? (
                                                <FolderOpen className="w-4 h-4 text-primary" />
                                            ) : (
                                                <Folder className="w-4 h-4 text-primary" />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-sm font-medium transition-colors duration-200",
                                            isHovered ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {name}
                                        </span>
                                        <div className="ml-auto text-xs text-muted-foreground opacity-0 transition-opacity duration-200">
                                            {children.length} item{children.length !== 1 && 's'}
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="animate-slide-down">
                                            {renderFileTree(children, `${fullPath}/`, level + 1)}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group",
                                        isSelected && 'bg-primary/20 text-primary backdrop-blur-sm border border-primary/30 shadow-lg shadow-primary/10',
                                        !isSelected && isHovered && "bg-white/10 backdrop-blur-sm scale-[1.02]",
                                        !isSelected && "hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02]"
                                    )}
                                    onClick={() => selectedFileStore.set(fullPath)}
                                    onMouseEnter={() => setHoveredItem(fullPath)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{ paddingLeft: `${level * 12 + 20}px` }}
                                >
                                    {(() => {
                                        const FileIcon = getFileIcon(name);
                                        const fileColor = getFileColor(name);
                                        return (
                                            <FileIcon className={cn(
                                                "w-4 h-4 flex-shrink-0 transition-colors duration-200",
                                                isSelected ? "text-primary" : fileColor
                                            )} />
                                        );
                                    })()}
                                    <span className={cn(
                                        "text-sm truncate transition-colors duration-200",
                                        isSelected ? "text-primary font-medium" : "text-muted-foreground"
                                    )}>
                                        {name}
                                    </span>
                                    {isSelected && (
                                        <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        )
    }

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mb-4">
                <FolderPlus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">No Files Yet</h3>
            <p className="text-sm text-muted-foreground max-w-48 leading-relaxed">
                Start a conversation to generate files and see them appear here.
            </p>
        </div>
    );

    return (
        <div className="h-full overflow-auto">
            {sortedFiles.length > 0 ? (
                <div className="space-y-4">
                    <div className="sticky top-0 bg-background/80 backdrop-blur-sm pb-2 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                Files ({sortedFiles.length})
                            </span>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                <span className="text-xs text-primary">Live</span>
                            </div>
                        </div>
                    </div>
                    {renderFileTree(sortedFiles)}
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    )
}