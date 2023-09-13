# Electron + Vite + React + NeDB + DDD  

## Introducción (ES)

Este proyecto se enfoca en el diseño y desarrollo de una arquitectura de aplicación de escritorio utilizando Electron como plataforma principal. La aplicación se ha concebido como un ecosistema integral que combina herramientas y tecnologías actuales.

### Objetivo Principal

El objetivo central de este proyecto es proporcionar una sólida base de código para el desarrollo de aplicaciones de escritorio multiplataforma. Esta base se apoya en varios pilares clave:

- **Electron:** Como plataforma principal, Electron permite crear aplicaciones de escritorio utilizando tecnologías web estándar.

- **Vite:** Utilizamos Vite como herramienta de compilación y desarrollo rápido para garantizar un flujo de trabajo ágil y eficiente.

- **React:** El frontend de la aplicación se basa en React, una de las bibliotecas más populares para construir interfaces de usuario modernas y dinámicas.

- **NeDB:** Como base de datos, NeDB ofrece una solución ligera y fácil de usar para el almacenamiento de datos en la aplicación de escritorio.

- **Diseño Dirigido por Dominio (DDD):** En el backend, adoptamos el enfoque de DDD para garantizar una arquitectura sólida y modular que se adapte a las necesidades de negocio.

### Propósito

Este proyecto tiene como propósito principal brindar a los desarrolladores una base de trabajo estable y altamente personalizable. Al aprovechar estas tecnologías y metodologías, esperamos que este proyecto sea una referencia valiosa para la creación eficiente de aplicaciones de escritorio.



## Cómo Funciona la Aplicación

La aplicación se dedica a simplificar la creación y gestión de notas simples con una interfaz de usuario intuitiva y eficiente. Aquí se destacan algunas de las características y funcionalidades principales que hacen que esta aplicación sea una herramienta versátil para tomar y organizar tus notas:

### Creación y Gestión de Notas

- **Crear Nueva Nota:** Puedes iniciar una nueva nota en cualquier momento con tan solo presionar el atajo de teclado `Ctrl + N` o haciendo clic en el botón correspondiente en la interfaz.

- **Edición de Notas:** La aplicación permite la edición fluida de tus notas existentes. Simplemente haz clic en la nota deseada y podrás realizar cambios en su contenido de manera rápida y sencilla.

- **Eliminación de Notas:** Cuando desees deshacerte de notas no deseadas, basta con utilizar un botón de eliminación intuitivo.

### Acceso Rápido con Atajos de Teclado

- **Atajos de Teclado:** La aplicación incluye atajos de teclado prácticos, como `Ctrl + N` para crear una nueva nota y `Esc` para cerrarla. Además, se han diseñado atajos para una navegación fluida y sin esfuerzo.

- **Tabulaciones:** Puedes utilizar las tabulaciones para acceder de manera eficaz a los botones y elementos de la interfaz de usuario, sin necesidad de recurrir al ratón.

### Modo de Interfaz Claro y Oscuro

- **Modo de Interfaz:** La aplicación ofrece la opción de cambiar entre un modo de interfaz claro y oscuro según tus preferencias. Esto permite una experiencia de usuario personalizada y cómoda en diferentes condiciones de iluminación.

### Configuración y Exportación

- **Configuración Personalizada:** La aplicación cuenta con una sección de configuración donde puedes ajustar las preferencias según tus necesidades. Esto incluye opciones de personalización de la interfaz, atajos de teclado y más.

- **Importación y Exportación:** La capacidad de importar y exportar notas en formato CSV facilita una gestión de datos eficiente y la portabilidad de tu información.

### Facilidad de Acceso y Comunicación

- **Acceso desde el Dock:** Para una experiencia aún más práctica, puedes acceder rápidamente a la aplicación desde el dock de tu sistema operativo para crear nuevas notas al instante.

- **Actualización Automática:** La aplicación mantiene tus notas actualizadas de forma automática, garantizando que siempre tengas acceso a la información más reciente.

- **Paginación y Comunicación entre Ventanas:** La capacidad de paginación y la comunicación fluida entre ventanas mejoran la organización y la interacción con tus notas, permitiendo un flujo de trabajo más eficiente.

Esta aplicación ofrece una solución eficaz y versátil para tomar notas y gestionar información, con una interfaz intuitiva y una gama de características que se adaptan a tus necesidades específicas. Ya sea que estés organizando tus pensamientos, tomando notas de reuniones importantes o simplemente manteniendo un registro de tus ideas, esta aplicación está diseñada para facilitar tu flujo de trabajo.


# Arquitectura del Proyecto

```
backend/
│
├── const/
│   ├── constants.js
│
├── utils/
│   ├── utilityFunctions.js
│
├── notes/
│   │
│   ├── application/
│   │   ├── errors/
│   │   ├── messages/
│   │   ├── use-cases/
│   │
│   ├── domain/
│   │   ├── errors/
│   │   ├── model/
│   │   ├── value-objects/
│   │
│   ├── infrastructure/
│   │   ├── errors/
│   │   ├── controllers/
│   │   ├── repositories/
│   │
│   ├── container.ts
```
La arquitectura de este proyecto sigue un enfoque organizado y modular basado en el Diseño Dirigido por Dominio (DDD). A continuación, se describe la estructura de carpetas y su propósito:

## Carpeta "const"

- **constants.js**: Contiene archivos relacionados con constantes utilizadas en todo el backend. Estas constantes pueden incluir valores compartidos en diversas partes de la aplicación.

## Carpeta "utils"

- **utilityFunctions.js**: Almacena utilidades y funciones compartidas que se utilizan en el backend. Estas funciones pueden ser de uso general en varias partes de la aplicación.

## Carpeta "notes"

La carpeta "notes" es la parte central de la aplicación y sigue una estructura organizativa basada en el Diseño Dirigido por Dominio (DDD).

### Subcarpeta "application"

Esta carpeta contiene la lógica de aplicación de la aplicación, que incluye los casos de uso de la aplicación.

- **Subcarpeta "errors"**: Almacena archivos relacionados con errores específicos de la capa de aplicación.

- **Subcarpeta "messages"**: Contiene archivos relacionados con mensajes y notificaciones de la aplicación.

- **Subcarpeta "use-cases"**: Contiene archivos que definen los casos de uso de la aplicación, representando acciones específicas que la aplicación puede realizar.

### Subcarpeta "domain"

En esta carpeta se definen las entidades, modelos y objetos de valor relacionados con el dominio de la aplicación.

- **Subcarpeta "errors"**: Almacena archivos relacionados con errores específicos de la capa de dominio.

- **Subcarpeta "model"**: Aquí se definen los modelos y entidades que representan los conceptos del dominio de la aplicación.

- **Subcarpeta "value-objects"**: Contiene archivos relacionados con objetos de valor, que son objetos inmutables que representan valores dentro del dominio.

### Subcarpeta "infrastructure"

La carpeta "infrastructure" se utiliza para implementar la capa de infraestructura, que incluye controladores y repositorios para interactuar con bases de datos o servicios externos.

- **Subcarpeta "errors"**: Almacena archivos relacionados con errores específicos de la capa de infraestructura.

- **Subcarpeta "controllers"**: Contiene los controladores que manejan las solicitudes HTTP o las interacciones con la interfaz de usuario.

- **Subcarpeta "repositories"**: Aquí se encuentran los repositorios utilizados para acceder y gestionar datos en la base de datos u otros sistemas de almacenamiento.

## "container.ts"

Este archivo se encuentra en la raíz de la carpeta "notes" y se utiliza para exportar instancias de los controladores u otros componentes que deben ser consumidos por la aplicación de Electron u otras partes del proyecto.

## Estructura de Carpetas de Electron

La estructura de carpetas de Electron en este proyecto se organiza de la siguiente manera:

```
electron/
│
├── icons/
│ ├── [Iconos del sistema]
│
├── main/
│ │
│ ├── [Archivos relacionados con la lógica principal de la aplicación]
│ │
│ ├── api/
│ │ │
│ │ ├── [Funciones y acciones protegidas del sistema]
│ │
│ ├── [Otros archivos y carpetas relacionados con la lógica principal de la aplicación]
│
├── preload/
│ │
│ ├── api/
│ │ │
│ │ ├── [Funciones y acciones del sistema accesibles de manera protegida desde la ventana de Electron]
│ │
│ ├── [Otros archivos y carpetas relacionados con el proceso de precarga]
```


### Carpeta "icons"

- La carpeta "icons" contiene los iconos utilizados en la aplicación de Electron para representar diferentes elementos del sistema.

### Carpeta "main"

- La carpeta "main" almacena archivos relacionados con la lógica principal de la aplicación de Electron. Esto incluye la inicialización de la aplicación, la conexión a la base de datos, el registro de eventos y acciones clave, y la apertura de nuevas ventanas, entre otros.

### Carpeta "preload"

- La carpeta "preload" contiene archivos relacionados con el proceso de precarga de la aplicación de Electron. La carpeta "api" dentro de "preload" alberga funciones y acciones del sistema que están protegidas y accesibles desde la ventana de Electron.

Esta estructura de carpetas y archivos se ha diseñado para organizar de manera efectiva la lógica y los recursos de la aplicación de Electron, asegurando una gestión clara y modular de las diferentes partes del sistema.
....


Thank you for exploring this project. While the README provides a starting point, keep in mind that this project is a work in progress. We encourage you to contribute, suggest improvements, and help shape its future.

Happy coding!
