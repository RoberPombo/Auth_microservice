# Microservicio de Autenticación

_Microservicio para la gestión de permisos de usuario. 
Cada usuario tendrá permisos a nivel compañia y luego permisos a nivel aplicación dentro de dicha compañia.
Además de poder pertenecer a varias compañías._

## Comenzando 🚀

_Clona o descarga el proyecto. Y ejecuta: npm install.
Es necesario tener un archivo .env con los datos indicados en el template (.env.template). El dato más importante es el string de conexión válido con Mongo.
Una vez cumplimentado el fichero: npm start_

_Si tienes Docker instalado (https://docs.docker.com/get-docker/) la forma más rapida de empezar a probar el proyecto es:
Dentro de la carpeta ./local_debug, renombrar el template a Docker.env
Ejecutar: npm run docker_

_Además hay una migration que crea un usuario en la BBDD (se necesita el archivo .env en la carpeta raíz):_

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