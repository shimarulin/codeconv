import type { TemplateModule } from '@codeconv/plugin-create'

const template: TemplateModule = {
  render (args) {
    console.log(args.name)
  },
}

export default template
