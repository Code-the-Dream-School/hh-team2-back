const notFound = (req, res) =>
  res.status(404).send('Route does not exist 0000');

module.exports = notFound;
