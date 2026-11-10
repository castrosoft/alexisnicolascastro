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

## Imágenes

Las fotos se sirven desde `public/images/<carpeta-del-equipo>/` y se registran en el arreglo `photos` de `src/translations.js`. Para agregar fotos a la trayectoria, copiá el archivo en la carpeta del equipo y agregá una entrada con su ruta y el nombre exacto del club. Al seleccionar ese club, sus fotos aparecen como miniaturas debajo de la imagen principal.

La portada usa el recorte transparente `public/images/portada/portada-removebg-preview.png` y el retrato de perfil, `public/images/profile/profile.jpg`.

Los escudos se sirven desde `public/escudos/`. Sus rutas y extensiones exactas están definidas en la lista de clubes de `src/translations.js`.

## Publicar en Netlify

La configuración de `netlify.toml` define `npm run build` como comando de build y `dist` como directorio publicado. Node 22 está fijado en `.nvmrc`.

- **Publicación manual:** ejecutá `npm run build` y arrastrá la carpeta `dist` al área de deploy manual de Netlify.
- **Deploys automáticos:** subí el proyecto a un repositorio Git y conectalo desde Netlify. Netlify usará la configuración del proyecto para publicar cada cambio.
