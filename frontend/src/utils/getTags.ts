
export const getTags = (tag:string,text:string) => {
    switch (tag) {
        case 'header':
            return (`## ${text}`);
        case 'italic':
            return (`*${text}*`);
        case 'bold':
            return (`**${text}**`);
        case 'ol':
            return (`1. ${text}`);
        case 'ul':
            return (`- ${text}`);
        case 'blockquote':
            return (`> ${text}`);
        case 'image':
            return (`![alt](${text})`);
        case 'link':
            return (`[title](${text})`);
        case 'code':
            return (`\`\`\`${text}\`\`\``);
        case 'task':
            return (`- [] ${text}`);
        default:
            throw new Error('Invalid tag');
    }
}
