import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"DM Mono"', 'monospace'], // sobreescribe la familia mono por defecto
            },
        },
    },
} satisfies Config;