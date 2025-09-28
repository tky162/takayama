// Import the generated handler from open-next
import handler from './.open-next/server-functions/default/index.mjs';

export default {
  async fetch(request, env, ctx) {
    return handler(request, env, ctx);
  },
};