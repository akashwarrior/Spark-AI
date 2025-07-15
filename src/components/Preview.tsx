'use client';

import { useRef } from "react";


export const Preview = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const url = "http://localhost:3000"

    return (
        <iframe
            src={url}
            ref={iframeRef}
            className={`w-full h-full`}
        />
    );
}