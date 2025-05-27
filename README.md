# Como iniciar el proyecto.
Primero debes asegurarte de que tengas NodeJS instalado en tu PC.
Si no lo tienes, instalalo desde la pagina oficial.
https://nodejs.org/en/download

Luego debes asegurarte de tener instalado Git tambien, si no lo tienes instalalo desde la pagina oficial.
https://git--scm-com.translate.goog/downloads?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

Una vez tengas todo instalado sigue los pasos.

Copia el link del repositorio
```sh
https://github.com/nicolas27-10/vic-ing-astro.git
```
Abre el simbolo de sistema desde la busqueda de windows o presiona Windows + R, escribe CMD y presiona ENTER.

Luego copia el repositorio en tu PC con el siguiente comando
```sh
git clone https://github.com/nicolas27-10/vic-ing-astro.git
```

Se copiara la carpeta del repositorio, por lo que debes cambiar el directorio en el cual estas trabajando en el CMD. Usa el siguiente comando
```sh
cd vic-ing-astro
```

Una vez en el directorio, deberas instalar las dependencias con
```sh
npm install
```

Abre la carpeta desde un editor de codigo como por ejemplo Visual Studio Code. puedes abrirlo desde el CMD en VS Code con
```sh
code .
```

Por ultimo, para iniciar el proyecto debes ejecutar el siguiente comando en la consola
```sh
npm run dev
```

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------




# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
