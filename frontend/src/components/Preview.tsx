import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

type Props = {
  markdown: string
}

const Preview = ({ markdown }:Props) => {
    marked.use({
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });
  return (
      <div className='text-lg font-light text-slate-700 markdown-css' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}></div>
  )
}

export default Preview