import manifestGen from '@codeconv/generator-manifest'

import type { TemplateModule } from '@codeconv/plugin-create'

const template: TemplateModule = {
  name: 'Library',
  describe: 'Create common lib',
  handler ({ name }) {
    const manifest = manifestGen.generate({
      name,
    })

    console.log(manifest)
  },
}

export default template
