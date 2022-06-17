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

//  <------------- Funciones Auxiliares para la API ------------->

function validarEmail(email) {

    let result = false;

    if (email.includes('@') && email.indexOf('@') > 0 && email.indexOf('.', email.indexOf('@'))) {
        result = true;
    }

    return result;
}

// Con un JWT nos devuelve true si es admin y false si es usuario

function esAdmin(token) {

    let result = false;

    const decoded = jwt.verify(token, "releevant");

    if (decoded.rol === "admin") {
        result = true;
    }
    return result;
}

// Función que desencripta el token y devuelve el id del usuario
function idToken(token) {

    let result;

    const decoded = jwt.verify(token, "releevant");

    if (decoded.rol === "admin") {
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
        await database.collection("usuarios").insertOne(request.body, function (err, res) {
            if (!res) {
                response.status(500).send("Error Inesperado. No se ha podido borrar el usuario.");
            } else {
                response.status(200).send("Usuario registrado correctamente");
            }
        });
    } else {
        response.status(400).send("Email no valido");
    }
});

//  Endpoint para: eliminar usuario existente
//  Parametros necesarios: ObjectId del usuario
//  Observaciones: 

app.delete("/eliminarusuario", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("usuarios").findOne({ _id: { $eq: ObjectId(request.body.id) } }, async function (err, result) {
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
            await database.collection("usuarios").findOne({ email: { $eq: request.body.email } },
                function (err, result) {
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


// Llamada auxiliar para testeo de desencriptado del token

app.get("/checktoken", (request, response) => {

    let result = "";

    const authorization = request.get("authorization");
    let token = authorization;

    const decoded = jwt.verify(token, "releevant");

    if (!token || !decoded.nombre) {
        response.status(401).send("Token No Válido")
    } else {
        result = decoded;
    }

    response.json(result)
})

//  Endpoint para: hacer un get del listado de usuarios
//  Parametros necesarios:  ninguno
//  Observaciones: devuelve un array con todos los usuarios de la tabla usuarios

app.get("/listadousuarios", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("usuarios").find().toArray((err, results) => {
        if (err) throw err;
        response.status(200).send(results);
    });
});

//  Endpoint para: Obtener/Crear/Modificar/Eliminar una plantilla
//  Parametros necesarios: Objeto Plantilla (id, titulo, texto, valores a rellenar, clausulas)
//  Observaciones: ten en cuenta que los datos los recoge el front, aquí debe llegar todos los datos y tendremos que 
//  asegurarnos de que NO nos vienen campos necesarios vacíos. 
//  No vamos a tener que llamar al 'crearnuevaclausula' puesto que esos datos ya vienen del front.
//  OJO: el put me genera un segundo campo id en el objeto plantilla, podría solucionarse pasando el id por params en lugar de por el body.

// El get necesita pasarle el id de la plantilla
app.get("/plantilla", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("plantillas").findOne({ _id: { $eq: ObjectId(request.body.id) } }, function (err, result) {
        if (!result) {
            response.status(404).send("Plantilla no existe");
        } else {
            response.status(200).send(result);
        }
    })
});

// Post necesita el cuerpo de la plantilla por el body
app.post("/plantilla", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Autorización requerida");
    } else {

        if (esAdmin(authorization)) {

            await database.collection("plantillas").insertOne(request.body,
                function (err, res) {
                    if (!res) {
                        response.status(500).send("Error Inesperado. No se ha podido crear nueva plantilla.");
                    } else {
                        response.status(200).send("Plantilla registrada correctamente");
                    }
                })

        } else {
            response.status(403).send("Usuario no autorizado");
        }
    }
});

// Put necesita en el body los datos a modificar + el id de la plantilla
app.put("/plantilla", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Autorización requerida");
    } else {

        if (esAdmin(authorization)) {

            await database.collection("plantillas").updateOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                { $set: request.body },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("Plantilla no existe")
                    } else {
                        response.status(200).send("Plantilla modificada con éxito")
                    }
                })

        } else {
            response.status(403).send("Usuario no autorizado");
        }
    }
});

// Delete necesita el id de la plantilla
app.delete("/plantilla", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Autorización requerida");
    } else {
        if (esAdmin(authorization)) {

            await database.collection("plantillas").deleteOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("Plantilla no existe")
                    } else {
                        response.status(200).send("Plantilla eliminada con éxito")
                    }
                })

        } else {
            response.status(403).send("Usuario no autorizado");
        }
    }

});

//  Endpoint para: Get/Post/Put/Delete Documento
//  Parametros necesarios: token de usuario, id del doc, titulo, 
//  Observaciones:

//Get necesita el id del documento
app.get("/documento", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documentos").findOne({ _id: { $eq: ObjectId(request.body.id) } },
        function (err, result) {
            if (!result) {
                response.status(404).send("Documento no existe");
            } else {
                response.status(200).send(result);
            }
        })

});

// Post necesita los campos del documento en el body de la request
// ***** Habrá que modificarlo, para que reciba el token del usuario e ingrese en el array de usuarios ese id
//       además, habrá que coger la plantilla y copiarla y meterla en la propiedad plantilla del documento
app.post("/documento", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documentos").insertOne(request.body, function (err, res) {
        if (!res) {
            response.status(500).send("Error Inesperado. No se ha podido crear nuevo documento.");
        } else {
            response.status(200).send("Documento registrado correctamente");
        }
    })
});

app.put("/documento", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documentos").updateOne(
        { _id: { $eq: ObjectId(request.body.id) } },
        { $set: request.body },
        function (err, res) {
            if (!res) {
                response.status(404).send("Documento no existe")
            } else {
                response.status(200).send("Documento modificado con éxito")
            }
        })
});

app.delete("/documento", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");
    if (!authorization) {
        response.status(401).send("Autorización requerida");
    } else {
        if (esAdmin(authorization)) {

            await database.collection("documentos").deleteOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("Documento no existe")
                    } else {
                        response.status(200).send("Documento eliminado con éxito")
                    }
                })
        } else {
            response.status(403).send("Usuario no autorizado");
        }
    }
});

//  Endpoint para: listar todos los documentos de un usuario
//  Parametros necesarios:  id del usuario
//  Observaciones:

app.get("/listadousuariodoc", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documentos").find({ usuarios: request.body.id }).toArray((err, results) => {
        if (!results) {
            response.status(404).send("No hay documentos asignados al usuario")
        } else {
            response.status(200).send(results);
        }
    });
});

//  Endpoint para: listar las plantillas    
//  Parametros necesarios: 
//  Observaciones:

app.get("/listadoplantillas", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("plantillas").find().toArray((err, res) => {
        if (!res) {
            response.status(404).send("No hay plantillas")
        } else {
            response.status(200).send(res);
        }
    });
});

//  Endpoint para: asignar un usuario a un documento (admin)
//  Parametros necesarios: id usuario, id documento
//  Observaciones:

app.put("/asignarusuario", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {

        response.status(401).send("Autorización requerida");

    } else {

        if (esAdmin(authorization)) {

            await database.collection("documentos").findOne({ _id: { $eq: ObjectId(request.body.idDocumento) }},
                function (err, result) {
                    if (!result) {
                        response.status(404).send("Documento no existe");
                    } else {
                        let aux = result;

                        aux.usuarios.push(request.body.idUsuario);

                        database.collection("documentos").updateOne(
                            { _id: { $eq: ObjectId(request.body.idDocumento) } },
                            { $set: aux },
                            function (err, res) {
                                response.status(200).send("Usuario asignado con éxito")
                            })
                    }
                })
        } else {
            response.status(403).send("Usuario no autorizado");
        }
    }
});



// ** NOTA ** Un endpoint es la URL o ruta, pero puede tener distintos métodos (get, post, put, delete) con distintas
//            funciones cada uno y distintas respuestas. Eso lo maneja ya el front cuando hace la llamada a la API


//  Endpoint para:
//  Parametros necesarios:
//  Observaciones:

// app.post("/", async function (request, response){

//     let database = db.db("bdabledocs");
// });
