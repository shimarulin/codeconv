# Управление релизами

Высокоуровневые инструменты:

- https://github.com/intuit/auto
- https://github.com/semantic-release/semantic-release
- https://github.com/conventional-changelog/standard-version

Процесс:

- получить текущую версию из тегов Git
- получить величину изменения версии на основе анализа коммитов
- рассчитать новую версию
- записать версию в манифест-файл(ы)
- сгенерировать чейнджлог(и) и записать в файл(ы)
- добавить изменения в Git, закоммитить
- (опционально) - опубликовать изменения в NPM
- запушить изменения в удаленный репозиторий

- https://github.com/npm/node-semver
- https://github.com/davidtheclark/cosmiconfig

## Generate changelog

```json
{
  "scripts": {
    "changelog": "pnpm -r exec -- pwd | xargs -I{} conventional-changelog --preset angular --release-count 0 --commit-path {} --pkg {}/package.json --outfile {}/CHANGELOG.md --verbose"
  }
}
```

## Monorepo run scripts

- https://github.com/lerna/lerna/tree/master/commands/run
- https://github.com/hfour/wsrun
- https://github.com/Akryum/monorepo-run
- https://github.com/folke/ultra-runner
- https://github.com/guigrpa/oao

## Best practices

- https://github.com/semantic-release/semantic-release/blob/caribou/docs/support/FAQ.md#can-i-set-the-initial-release-version-of-my-package-to-001
- https://github.com/semantic-release/semantic-release/blob/caribou/docs/support/FAQ.md#is-it-really-a-good-idea-to-release-on-every-push

## Deploy

- https://github.com/shipitjs/shipit
