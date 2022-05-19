import type { TemplateModule } from '@codeconv/plugin-create'

const template: TemplateModule = {
  name: 'Library',
  description: 'Create common lib',
  render (args) {
    console.log(args.name)
  },
}

export default template
