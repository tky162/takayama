import type { OpenNextConfig } from 'open-next/types/open-next.js'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare',
      converter: 'edge',
    },
  },
  dangerous: {
    disableIncrementalCache: true,
    disableTagCache: true,
  },
}

export default config
