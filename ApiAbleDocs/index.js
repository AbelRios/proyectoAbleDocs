const { response } = require('express');
const express = require('express');
const { ObjectId } = require("mongodb");
const md5 = require("nodejs-md5");
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

let db = null;
let MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017/", (err, client) => {
    if (err) throw err;
    db = client
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

//  Funciones Auxiliares para la API

function validarEmail(email) {

    let result = false;

    if (email.includes('@') && email.indexOf('@') > 0 && email.indexOf('.', email.indexOf('@'))) {
        result = true;
    }

    return result;
}


//  Endpoint para: creación de nuevo usuario
//  Parametros necesarios: nombre, email, password
//  Observaciones: 
//      Asignamos directamente el rol a "usuario" hardcodeado

app.post("/nuevousuario", async function (request, response) {

    let database = db.db("bdabledocs");

    request.body.rol = "usuario";

    md5.string.quiet(request.body.password, function (err, md5) {
        if (err) {
            console.log(err);
        }
        else {
            request.body.password = md5;
        }
    })

    if (validarEmail(request.body.email)) {
        await database.collection("usuarios").insertOne(request.body);
        response.status(200).send("Usuario registrado correctamente");
    } else {
        response.status(400).send("Email no valido");
    }
});

//  Endpoint para: eliminar usuario existente
//  Parametros necesarios: ObjectId del usuario
//  Observaciones: 

app.delete("/eliminarusuario", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("usuarios").findOne({ id: { $eq: request.body.id } }, async function (err, result) {
        if (!result) {
            response.status(404).send("Usuario no existe");
        } else {
            await database.collection("usuarios").deleteOne(
                { _id: ObjectId(request.body.id) }, function (err, res) {
                    if (!res) {
                        response.status(500).send("Error Inesperado. No se ha podido borrar el usuario.");
                    } else {
                        response.status(200).send("Usuario eliminado correctamente");
                    }
                }
            );
        }
    })
});

//  Endpoint para: login de usuario
//  Parametros necesarios:  email de usuario, password
//  Observaciones: 
//      el token generado devuelve: id, nombre de usuario y rol. 
//      el token expira en 6 horas
//      Este token lo guardaremos en el context del front end para pasarlo a los endpoints que nuestros componentes 
//          necesiten como por ejemplo el listado de documentos del usuario, el listado de plantillas, etc. 
//          y para el logout lo borraremos del context

app.post("/login", async function (request, response) {

    let database = db.db("bdabledocs");

    md5.string.quiet(request.body.password, async function (err, md5) {
        if (err) {
            console.log(err);
        }
        else {
            request.body.password = md5;
            await database.collection("usuarios").findOne({ email: { $eq: request.body.email } }, function (err, result) {
                if (!result) {
                    response.status(404).send("Usuario no existe");
                } else {
                    if (request.body.password === result.password) {
                        const accessToken = jwt.sign({ id: result._id, nombre: result.nombre, rol: result.rol }, "releevant", { expiresIn: '6h' });
                        response.status(200).send(accessToken);
                    } else {
                        response.status(401).send("Password no valida.")
                    }
                }
            })
        }
    })
});

//  Endpoint para: Obtener/Crear/Modificar/Eliminar una nueva plantilla
//  Parametros necesarios: 
//  Observaciones: ten en cuenta que los datos los recoge el front, aquí debe llegar todos los datos y tendremos que 
//  asegurarnos de que NO nos vienen campos necesarios vacíos. 
//  No vamos a tener que llamar al 'crearnuevaclausula' puesto que esos datos ya vienen del front.

app.get("/plantilla", async function (request, response){

    let database = db.db("bdabledocs");
});

app.post("/plantilla", async function (request, response){

    let database = db.db("bdabledocs");
});

app.put("/plantilla", async function (request, response){

    let database = db.db("bdabledocs");
});

app.delete("/plantilla", async function (request, response){

    let database = db.db("bdabledocs");
});






// ** NOTA ** Un endpoint es la URL o ruta, pero puede tener distintos métodos (get, post, put, delete) con distintas
//            funciones cada uno y distintas respuestas. Eso lo maneja ya el front cuando hace la llamada a la API


//  Endpoint para:
//  Parametros necesarios:
//  Observaciones:

// app.post("/", async function (request, response){

//     let database = db.db("bdabledocs");
// });
