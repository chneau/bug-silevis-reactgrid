# bug-silevis-reactgrid

Minimal reproduction of a Silevis React Grid issue under Rsbuild.

The repository contains only the grid configuration needed to trigger the problem: the smallest grid setup is in `src/` and the Rsbuild configuration is in `rsbuild.config.ts`. There is no application logic beyond the reproduction.

## Reproduce

```bash
bun install
bun start
```

The issue appears as soon as the page renders the grid, so no further interaction is required.

## License

MIT
