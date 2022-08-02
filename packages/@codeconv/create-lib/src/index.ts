import type { TemplateModule } from '@codeconv/plugin-create'

const template: TemplateModule = {
  name: '',
  describe: '',
  async handler (args, ctx) {
    console.log(args, ctx)
    return Promise.resolve()
  },
}

export default template
