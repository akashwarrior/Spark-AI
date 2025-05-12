import { WebContainer } from '@webcontainer/api';

import { useEffect, useState } from "react";

class WebContainerClass {
    private static instance: WebContainerClass;
    private webContainer: WebContainer | null = null;

    private constructor() { }

    public static getInstance() {
        if (!WebContainerClass.instance) {
            WebContainerClass.instance = new WebContainerClass();
        }
        return WebContainerClass.instance;
    }

    public async boot() {
        if (this.webContainer) return this.webContainer;
        this.webContainer = await WebContainer.boot();
        return this.webContainer;
    }
}

export const useWebContainer = () => {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    useEffect(() => {
        WebContainerClass.getInstance().boot().then((container) => {
            console.log("WebContainer booted");
            setWebContainer(container);
        });
    }, [webContainer]);

    return webContainer;
}