# bug-silevis-reactgrid

Minimal reproduction of a Silevis React Grid issue under Rsbuild.

## Reproduce

```bash
bun install
bun start
```

The app renders the grid with the smallest configuration that triggers the problem. The grid setup is in `src/`; `rsbuild.config.ts` contains the build configuration used by the reproduction.

## License

MIT
