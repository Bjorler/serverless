# Novo Eventos 2

## Serverless Template Change Log

* Domingo 22 mayo 2022 -- 1.1
  
    1. Comando lambda
  
        * Ahora el permiso 'm' o 'method' toma el valor 'get' si no se le pasa un valor.

        * Ahora el permiso 'a' o 'auth' toma el valor 'tokenAuthorizer' si se declara.
        
        * Ahora el tipado ApiEvent toma como argumento la interfáz del validador y ya no el de la entidad.

    2. Mongoose BaseSchema

        * Ahora se puede resolver el mensaje de salida con los métodos encadenados onNull() y onError().

        * Ahora el mensaje de salida para las validaciones de formulario es automático.

        * Ahora el mensaje de salida para registros duplicados es automático.

    3. Translations

        * Se agregó el soporte para los códigos de respuesta.

        * Se agregó el soporte para multilenguaje.