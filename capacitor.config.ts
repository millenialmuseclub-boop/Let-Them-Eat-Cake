import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.letthemeatcake.app',
  appName: 'Let Them Eat',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      // Zero-server OTA (see OTA_UPDATES.md): app-side TS in src/lib/otaUpdater.ts
      // owns the update decision by polling a static manifest.json on R2, so
      // autoUpdate must stay off — the plugin never talks to a Capgo backend.
      autoUpdate: false,
      // Public half of the key pair generated via `npx @capgo/cli key create`.
      // Safe to embed — it only lets the plugin verify/decrypt bundles signed
      // with the matching private key, which lives only in the CAPGO_PRIVATE_KEY
      // GitHub secret. Rotating this requires a new store build (see OTA_UPDATES.md).
      publicKey:
        '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEA0TnpGNshjZhpvuwuJ1dGINYNwvbTYGblK+ryNQ8UrvQsxzg8UhDb\no9oibq1hhPy8tU0PrnuHJY6GLhCzeCzLvR9cF3GQexWXTctqMXape3yv1YxTz3/G\n8CsXNVwFEOtC1pqLXlB3sMjOdpTEn9CWgJFMcKg40Egdsd1ZqkJmqoJSJqiCNX7u\nANcdN14fBpl2K22MHBQzAXEBUm7UX5cB9A2LlrPMgDXs7YaRrNSeZiy8HorAXzPj\nGOP/MS1/Y73LuR4Xt/qvE7CPRIsbQxfAGwgEfoZHlKcHwJGg5eSmyNrr3DZfywPC\nwDSoZDS4ag/Gr1yzK9bN4RTSUAj6Z94BhwIDAQAB\n-----END RSA PUBLIC KEY-----\n',
      // A monotonically-increasing build timestamp (git commit time, seconds since
      // epoch), set by each native build workflow before `npx cap sync`. Lets
      // src/lib/otaUpdater.ts tell whether an OTA manifest is actually NEWER than
      // what's natively baked in, instead of just "different" -- without this, a
      // fresh native build (whose baked-in code can be newer than the last OTA
      // push) would incorrectly downgrade itself to the older published bundle on
      // first launch, since its own version wouldn't match the manifest's at all.
      version: process.env.APP_BUILD_VERSION,
    },
  },
};

export default config;
