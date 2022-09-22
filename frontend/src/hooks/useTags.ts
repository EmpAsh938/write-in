import { useState } from 'react';

export const useTags = (tag:string,text:string) => {
    const [finalString,setFinalString] = useState<string>('');
    switch (tag) {
        case 'header':
            setFinalString(`##${text}`);
            break;
        case 'italic':
            setFinalString(`*${text}*`);
            break;
        case 'bold':
            setFinalString(`**${text}**`);
            break;
        case 'ol':
            setFinalString(`1. ${text}`);
            break;
        case 'ul':
            setFinalString(`- ${text}`);
            break;
        case 'blockquote':
            setFinalString(`> ${text}`);
            break;
        case 'image':
            setFinalString(`![${text}][url]`);
            break;
        case 'link':
            setFinalString(`[${text}][url]`);
            break;
        case 'code':
            setFinalString(`\`\`\`${text}\`\`\``);
            break;
        case 'task':
            setFinalString(`- [] ${text}`);
            break;
        default:
            throw new Error('Invalid tag');
    }
    return finalString;
}