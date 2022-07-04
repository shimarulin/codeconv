import type { TemplateModule } from '@codeconv/plugin-create'
import { tpl, TemplateInputOptions } from '@codeconv/tpl'
import ejsHandler from '@codeconv/tpl-ejs-handler'

const template: TemplateModule = {
  name: 'Library',
  describe: 'Create common lib',
  async handler ({ name }) {
    /**
     * if (!name) {
     *   input name
     * }
     * if (ctx.project) {
     *   select namespace if ctx.namespaces.length > 1
     * }
     * */

    // const manifest = manifestGen.generate({
    //   name,
    // })
    //
    // console.log(manifest)
    console.log(name)

    // const templateFileListItems = await getRecursiveFileList(new URL('../templates/typescript', import.meta.url))
    //
    // console.log(templateFileListItems)
    // console.log(templateFileListItems.map((item) => join(item.root, format(item))))

    const templateInputOptions: TemplateInputOptions = {
      input: [
        '/home/shimarulin/Проекты/Tools/codeconv/packages/@codeconv/template-library/templates/javascript',
        '/home/shimarulin/Проекты/Tools/codeconv/packages/@codeconv/template-library/templates/common',
      ],
      output: '/home/shimarulin/Проекты/Tools/codeconv/packages/@codeconv/template-library/out',
      data: {
        license: {
          licenseText: 'MIT is license',
        },
        manifest: {
          name: 'ttt',
          description: 'description',
          license: 'MIT',
        },
      },
      handlers: [
        ejsHandler,
      ],
    }

    await tpl(templateInputOptions)
  },
}

export default template
