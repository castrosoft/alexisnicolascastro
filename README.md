# Alexis Castro — sitio web

Sitio de presentación creado con React, Vite y Tailwind CSS.

## Desarrollo local

Requiere Node.js 22.

```sh
npm install
npm run dev
```

## Build de producción

```sh
npm run build
```

Vite genera el sitio listo para publicar en `dist/`.

## Publicar en Netlify

La configuración de `netlify.toml` define `npm run build` como comando de build y `dist` como directorio publicado. Node 22 está fijado en `.nvmrc`.

- **Publicación manual:** ejecutá `npm run build` y arrastrá la carpeta `dist` al área de deploy manual de Netlify.
- **Deploys automáticos:** subí el proyecto a un repositorio Git y conectalo desde Netlify. Netlify usará la configuración del proyecto para publicar cada cambio.
