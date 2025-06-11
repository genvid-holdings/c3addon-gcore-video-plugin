# Genvid Construct 3 Addon Template

## Template Setup

1. Replace the name of the module `c3addon-template` with your own.
2. Replace all occurences of `Genvidtech_GCoreVideoPlugin` with the plugin's ID.

## To use

Explain the API here.

## To develop

```bash
npx http-server src --cors
```

Because of the restricted CSP in Construct3, make sure to use http://localhost:8080/addon.json instead of 127.0.0.1.

## To build

```bash
npm run all:{platform}
```

where platform is either `windows` or `posix`.
