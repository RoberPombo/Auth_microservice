# Microservicio de Autenticación

_Microservicio para la gestión de permisos de usuario. 
Cada usuario tendrá permisos a nivel compañia y luego permisos a nivel aplicación dentro de dicha compañia.
Además de poder pertenecer a varias compañías._

## Comenzando con npm start:

_Clona o descarga el proyecto. Y ejecuta: npm install.
Es necesario tener un archivo .env con los datos indicados en el template (.env.template). El dato más importante es el string de conexión válido con Mongo._

_Una vez cumplimentado el fichero: npm start_


## Comenzando con docker:

_La forma más rápida de empezar a probar el proyecto es usando docker (enlace para instalar docker: https://docs.docker.com/get-docker/):_

_Dentro de la carpeta ./local_debug, renombrar el template (Docker.env.template) a Docker.env y el template (env.template) a .env._

_Ejecutar: npm run docker_

_Además hay una migration que crea un usuario en la BBDD que pertenece a la corporación testCORP:_

```
email: admin@admin.com
password: admin12!
```

_Para debugear el contenedor de docker, puedes añadir o crear el archivo (.vscode/launch.json) con la siguiente configuración:_

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach",
      "type": "node",
      "request": "attach",
      "port": 5001,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/usr/src/app",
      "protocol": "inspector"
    }
  ]
}
```

_Además dentro de la carpeta (docs/postman) está la collection y el environment para probar el microservicio desde Postman._

_Al abrir el proyecto con docker se levanta un docker para mostrar el swagger (http://localhost:8080/)._