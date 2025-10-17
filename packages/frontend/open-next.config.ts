import type { OpenNextConfig } from 'open-next/types/open-next.js'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare',
    },
  },
}

export default config
