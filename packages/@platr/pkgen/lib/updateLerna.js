module.exports = (
  data,
  { version },
) => {
  return {
    version,
    ...data,
  }
}
