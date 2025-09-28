/** @type {import('open-next').OpenNextConfig} */
const config = {
  default: {
    override: {
      wrapper: 'cloudflare',
      converter: 'edge',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
};

module.exports = config;