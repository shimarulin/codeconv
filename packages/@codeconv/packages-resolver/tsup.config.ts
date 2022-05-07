import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.ts',
    ],
    format: [
      'esm',
    ],
    onSuccess: options.watch ? "notify-send '⚡⚡⚡ Build \"@codeconv/packages-resolver\" success ⚡⚡⚡'" : undefined,
    dts: !options.watch,
  }
})
