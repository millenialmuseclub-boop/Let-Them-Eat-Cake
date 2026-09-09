import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); } catch (error) {
      if (specifier.startsWith('.')) {
        for (const extension of ['.ts', '.json']) {
          try { return nextResolve(specifier + extension, context); } catch {}
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    return nextLoad(url, url.endsWith('.json') ? { ...context, importAttributes: { type: 'json' } } : context);
  }
});
