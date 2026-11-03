# recetas-app

Una app web de recetas con una pantalla para descubrir y filtrar, recetas favoritas, un planificador de comidas por día, una lista de compras y un formulario para agregar tus propias recetas. Es solo frontend: no hay servidor ni cuentas, y todo lo que guardas se queda en tu navegador.

La hice para practicar un frontend con varias pantallas y un estado que sobrevive a recargar la página, sin montar un backend.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7 · Zustand · i18next · TanStack Query · Framer Motion

## Qué tiene

- Seis recetas de ejemplo con ingredientes, pasos, tiempo, porciones y calorías, en español e inglés (`src/data/recipes.ts`).
- Pantallas de inicio, descubrir, guardadas, plan de comidas, lista de compras, agregar receta, detalle de receta y ajustes.
- Cambio de idioma (español e inglés) y de tema claro u oscuro.
- Favoritos, lista de compras, plan de comidas y recetas propias persistidos en `localStorage` con el middleware `persist` de Zustand.

## Cómo correrlo

```bash
npm install
npm run dev
```

`npm run build` compila con `tsc -b` y empaqueta con Vite, y `npm run lint` corre ESLint.

## Lo que no tiene

- No hay backend. Las recetas de ejemplo están escritas a mano en el código y las que agregas viven solo en tu navegador: si borras los datos del sitio, se pierden.
- No tiene tests.
- Las fotos de las recetas se cargan desde Unsplash, así que dependen de ese servicio.
- Son seis recetas de ejemplo, no un catálogo.
