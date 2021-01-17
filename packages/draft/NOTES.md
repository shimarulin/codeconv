# Packages

## Actions

- `create` - create package
- `setup` - set package structure (template/preset)
- `enable` - enable extra features support (babel/typescript/tests)

## Create

```shell
codeconv create
codeconv create my-awesome-project
```

Create common abstract project/package.

Proposals:

- last question - "Set up the package structure?". If not, print the message:
  > You can set up package structure later by command `codeconv setup`
  > and(or) add extra features with `codeconv enable`
  > 

## Setup

```shell
codeconv setup
codeconv setup lib
```

Select one of the many common presets to customize your project structure.

## Extend functionality

```shell
codeconv insert typescript
codeconv insert test
```

```shell
codeconv enable typescript
codeconv enable test
```
