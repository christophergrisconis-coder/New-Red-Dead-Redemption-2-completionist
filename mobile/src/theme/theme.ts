export const theme = {
  colors: {
    bg: '#14100b',
    bgElev: '#1c1712',
    surface: '#221b14',
    surfaceAlt: '#2a2119',
    border: '#3a2e22',
    borderStrong: '#4a3a2a',
    parchment: '#e9d9b8',
    parchmentDim: '#b8a686',
    muted: '#8a7a62',
    brass: '#c9a24b',
    brassDim: '#8a6d2f',
    accent: '#d7823a',
    danger: '#a83a2a',
    success: '#7aa04a',
    official: '#c9a24b',
    extra: '#7a8ea0',
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  space: (n: number) => n * 4,
  font: {
    heading: undefined as string | undefined, // system serif on iOS via fontFamily 'Georgia'
    body: undefined as string | undefined,
  },
};

export type Theme = typeof theme;
