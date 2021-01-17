//
// https://www.tldp.org/LDP/abs/html/escapingsection.html
//
// https://gist.github.com/gesquive/88d1e56293e1f6ca2330#file-get_keypress-py-L33
// # Here are the various escape sequences we can capture
// # '\x0d': 'return'
// # '\x7f': 'backspace'
// # '\x1b': 'escape'
// # '\x01': 'ctrl+a'
// # '\x02': 'ctrl+b'
// # '\x03': 'ctrl+c'
// # '\x04': 'ctrl+d'
// # '\x05': 'ctrl+e'
// # '\x06': 'ctrl+f'
// # '\x1a': 'ctrl+z'
// # '\x1b\x4f\x50': 'f1'
// # '\x1b\x4f\x51': 'f2'
// # '\x1b\x4f\x52': 'f3'
// # '\x1b\x4f\x53': 'f4'
// # '\x1b\x4f\x31\x35\x7e': 'f5'
// # '\x1b\x4f\x31\x37\x7e': 'f6'
// # '\x1b\x4f\x31\x38\x7e': 'f7'
// # '\x1b\x4f\x31\x39\x7e': 'f8'
// # '\x1b\x4f\x31\x30\x7e': 'f9'
// # '\x1b\x4f\x31\x31\x7e': 'f10'
// # '\x1b\x4f\x31\x33\x7e': 'f11'
// # '\x1b\x4f\x31\x34\x7e': 'f12'
// # '\x1b\x5b\x41': 'up'
// # '\x1b\x5b\x42': 'down'
// # '\x1b\x5b\x43': 'right'
// # '\x1b\x5b\x44': 'left'
// # '\x1b\x4f\x46': 'end'
// # '\x1b\x4f\x48': 'home'
// # '\x1b\x5b\x32\x7e': 'insert'
// # '\x1b\x5b\x33\x7e': 'delete'
// # '\x1b\x5b\x35\x7e': 'pageup'
// # '\x1b\x5b\x36\x7e': 'pagedown'

export const keys = {
  up: '\x1B\x5B\x41',
  down: '\x1B\x5B\x42',
  left: '\x1B\x5B\x44',
  right: '\x1B\x5B\x43',
  home: '\x1B\x4F\x48',
  end: '\x1B\x4F\x46',
  enter: '\x0D',
  space: '\x20',
  tab: '\t',
  esc: '\x1B',
  delete: '\x1B\x5B\x33\x7e',
}
