// Import the generated handler from open-next
import handler from './.open-next/server-functions/default/index.mjs';

const worker = {
  async fetch(request, env, ctx) {
    return handler(request, env, ctx);
  },
};

export default worker;