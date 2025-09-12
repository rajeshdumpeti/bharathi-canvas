import React, { useEffect, useRef, useState } from 'react';
import mammoth from 'mammoth';

function dataURLToArrayBuffer(dataURL) {
    const base64 = dataURL.split(',')[1] || dataURL;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

const DocxRenderer = ({ dataURL, className = 'h-[70vh] overflow-auto rounded border bg-white p-4' }) => {
    const ref = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            setError('');
            if (!ref.current || !dataURL) return;
            ref.current.innerHTML = 'Loading…';
            try {
                const arrayBuffer = dataURLToArrayBuffer(dataURL);
                const { value: html } = await mammoth.convertToHtml({ arrayBuffer }, {
                    includeDefaultStyleMap: true,
                    styleMap: [
                        "p[style-name='Heading 1'] => h1:fresh",
                        "p[style-name='Heading 2'] => h2:fresh",
                    ],
                });
                ref.current.innerHTML = html || '<div style="color:#6b7280">Empty document</div>';
            } catch (e) {
                console.error(e);
                setError('Failed to render DOCX.');
                ref.current.innerHTML = '';
            }
        })();
    }, [dataURL]);

    return (
        <div className={className}>
            {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
            <div ref={ref} className="prose max-w-none p-4"></div>
        </div>
    );
};

export default DocxRenderer;
