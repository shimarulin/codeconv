import { render } from 'ejs'
import { extname, basename } from 'node:path'
import type { TemplateHandler } from '@codeconv/tpl'

export const ejsHandler: TemplateHandler = (template, data) => {
  if (template.ext === '.ejs') {
    const ext = extname(template.name)
    const name = basename(template.name, ext)
    const base = template.name

    return {
      ...template,
      ext,
      name,
      base,
      content: render(template.content, data),
    }
  } else {
    return template
  }
}

export default ejsHandler
