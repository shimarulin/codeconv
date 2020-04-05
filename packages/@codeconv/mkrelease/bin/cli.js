const { release } = require('../lib/release')

const start = () => {
  release()
    .then(() => {
    })
    .catch((e) => {
      console.dir(e)
    })
}

start()
