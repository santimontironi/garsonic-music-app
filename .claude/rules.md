# Garsonic — Reglas

## Calidad del código

- No generar código innecesario, redundante ni desprolijo.
- No dejar código sin usar desparramado por el proyecto: funciones, imports, variables, tipos, componentes o archivos que nadie llama se borran.
- El código debe ser estructurado, ordenado, prolijo y legible.

## Idioma del código

- Variables, archivos y carpetas van TODOS en inglés.
- Los textos que ve el usuario en la interfaz siguen en español.

## Componentes

- No hacer componentes para todo. Un componente se crea solo cuando es una sección con mucho HTML o contenido reutilizable.
- Si algo se usa en un solo lugar y es poco HTML, va inline en la página o componente que lo usa (por ejemplo, las secciones de Home van dentro de Home, y los links con forma de botón van dentro de Header).

## Iconos

Cuando haga falta un icono, se coloca con una etiqueta `<i>` y el `className` de Bootstrap Icons, por ejemplo `<i className="bi bi-play-fill"></i>`. No usar SVG sueltos ni otras librerías de iconos.

## Estilos (frontend)

Los estilos que genere el subagente de frontend deben ser SÍ o SÍ mobile-first y usar únicamente estos breakpoints:

| Medida | Prefijo Tailwind |
|---|---|
| Mobile (base, first-mobile) | sin prefijo |
| md | `md:` |
| xl | `xl:` |
| xxl | `2xl:` |

No usar ningún otro breakpoint (`sm:`, `lg:`, etc.).

## Constantes

- No generar constantes en archivos de componentes, services ni controllers.
- Las constantes van SIEMPRE en la carpeta `utils`, pero `utils` es solo para constantes útiles y de peso: datos grandes o configuraciones que se comparten entre varios archivos.
- Los textos de la interfaz, las rutas, los datos de ejemplo y los valores chicos que se usan en un solo lugar NO son constantes de `utils`: van directo donde se usan.

## Decisiones

Cuando haya que tomar una decisión que no esté pactada, o algo "nuevo", se pregunta antes de hacerlo.
