import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
    useEffect(() => {
        // 1. Update Title
        document.title = `${title} | EVA by Inspired`;

        // 2. Update Meta Tags
        const updateMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const updateOgMeta = (property: string, content: string) => {
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        if (description) {
            updateMeta('description', description);
            updateOgMeta('og:description', description);
        }

        if (image) {
            updateOgMeta('og:image', image);
        }

        if (url) {
            updateOgMeta('og:url', url);
        }

        updateOgMeta('og:title', title);

        // Cleanup (optional, depends on if we want to revert on unmount)
        // For SPA, usually fine to just let the next page overwrite it.
    }, [title, description, image, url]);

    return null;
};
