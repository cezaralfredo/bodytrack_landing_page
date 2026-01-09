import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                politica: resolve(__dirname, 'politica-de-privacidade.html'),
                termos: resolve(__dirname, 'termos-de-uso.html'),
            },
        },
    },
});
