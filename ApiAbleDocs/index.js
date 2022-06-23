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

//  <------------- Datos Auxiliares para la API ------------->

const baseNotification = {

}



//  <------------- Funciones Auxiliares para la API ------------->

function validateEmail(email) {

    let result = false;

    if (email.includes('@') && email.indexOf('@') > 0 && email.indexOf('.', email.indexOf('@'))) {
        result = true;
    }

    return result;
}

// Con un JWT nos devuelve true si es admin y false si es usuario
function isAdmin(token) {

    let result = false;

    const decoded = jwt.verify(token, "releevant");

    if (decoded.roles.includes(1990)) {
        result = true;
    }
    return result;
}

// Función que desencripta el token y devuelve el id del usuario
function idToken(token) {

    const decoded = jwt.verify(token, "releevant");

    return decoded.id;
}

//  <------------- Endpoints de la API ------------->

//  Endpoint para: creación de nuevo usuario
//  Parametros necesarios: name, email, password
//  Observaciones: 
//      Asignamos directamente el rol a "usuario" hardcodeado

app.post("/newuser", async function (request, response) {

    let database = db.db("bdabledocs");

    request.body.roles = [1984];

    // Aquí insertar notificación base

    md5.string.quiet(request.body.password, function (err, md5) {
        if (err) {
            console.log(err);
        }
        else {
            request.body.password = md5;
        }
    })

    if (validateEmail(request.body.email)) {
        await database.collection("users").insertOne(request.body, function (err, res) {
            if (!res) {
                response.status(500).send("Unespected Error. Could not create user.");
            } else {
                response.status(200).send("User registered correctly.");
            }
        });
    } else {
        response.status(400).send("Email not valid");
    }
});

//  Endpoint para: eliminar usuario existente
//  Parametros necesarios: ObjectId del usuario
//  Observaciones: 

app.delete("/deleteuser", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("users").findOne({ _id: { $eq: ObjectId(request.body.id) } }, async function (err, result) {
        if (!result) {
            response.status(404).send("User does not exist.");
        } else {
            await database.collection("users").deleteOne(
                { _id: ObjectId(request.body.id) }, function (err, res) {
                    if (!res) {
                        response.status(500).send("Unexpected error. Could not delete user.");
                    } else {
                        response.status(200).send("User deleted correctly.");
                    }
                }
            );
        }
    })
});

//  Endpoint para: login de usuario
//  Parametros necesarios:  email de usuario, password
//  Observaciones: 
//      el token generado devuelve: id, name de usuario y rol. 
//      el token expira en 6 horas
//      Este token lo guardaremos en el context del front end para pasarlo a los endpoints que nuestros componentes 
//          necesiten como por ejemplo el listado de documents del usuario, el listado de templates, etc. 
//          y para el logout lo borraremos del context

app.post("/login", async function (request, response) {

    let database = db.db("bdabledocs");

    md5.string.quiet(request.body.password, async function (err, md5) {
        if (err) {
            console.log(err);
        }
        else {
            request.body.password = md5;
            await database.collection("users").findOne({ email: { $eq: request.body.email } },
                function (err, result) {
                    if (!result) {
                        response.status(404).send("User does not exist.");
                    } else {
                        if (request.body.password === result.password) {
                            const accessToken = jwt.sign({ id: result._id, name: result.name, roles: result.roles }, "releevant", { expiresIn: '6h' });
                            response.status(200).send(accessToken);
                        } else {
                            response.status(401).send("Password not valid.")
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

    if (!token || !decoded.name) {
        response.status(401).send("Token Not Valid")
    } else {
        result = decoded;
    }

    response.json(result)
})

//  Endpoint para: hacer un get del listado de users
//  Parametros necesarios:  ninguno
//  Observaciones: devuelve un array con todos los users de la tabla users

app.get("/userslist", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("users").find().toArray((err, results) => {
        if (err) throw err;
        response.status(200).send(results);
    });
});

//  Endpoint para: Obtener/Crear/Modificar/Eliminar una template
//  Parametros necesarios: Objeto template (id, titulo, texto, valores a rellenar, clausulas)
//  Observaciones: ten en cuenta que los datos los recoge el front, aquí debe llegar todos los datos y tendremos que 
//  asegurarnos de que NO nos vienen campos necesarios vacíos. 
//  No vamos a tener que llamar al 'crearnuevaclausula' puesto que esos datos ya vienen del front.
//  OJO: el put me genera un segundo campo id en el objeto template, podría solucionarse pasando el id por params en lugar de por el body.

// El get necesita pasarle el id de la template
app.get("/template", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("templates").findOne({ _id: { $eq: ObjectId(request.body.id)}}, function (err, result) {
        if (!result) {
            response.status(404).send("template does not exist");
        } else {
            response.status(200).send(result);
        }
    })
});

// Post necesita el cuerpo de la template por el body
app.post("/template", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("authorization required");
    } else {

        if (isAdmin(authorization)) {

            await database.collection("templates").insertOne(request.body,
                function (err, res) {
                    if (!res) {
                        response.status(500).send("Unexpected error. Could not create new template.");
                    } else {
                        response.status(200).send("template registered correctly");
                    }
                })

        } else {
            response.status(403).send("User not authorized");
        }
    }
});

// Put necesita en el body los datos a modificar + el id de la template
app.put("/template", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Authorization required");
    } else {

        if (isAdmin(authorization)) {

            await database.collection("templates").updateOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                { $set: request.body },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("template does not exist")
                    } else {
                        response.status(200).send("template modified successfully")
                    }
                })

        } else {
            response.status(403).send("User not authorized");
        }
    }
});

// Delete necesita el id de la template
app.delete("/template", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Authorization required");
    } else {
        if (isAdmin(authorization)) {

            await database.collection("templates").deleteOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("template does not exist")
                    } else {
                        response.status(200).send("template deleted successfully")
                    }
                })

        } else {
            response.status(403).send("User not authorized");
        }
    }

});

//  Endpoint para: Get/Post/Put/Delete document
//  Parametros necesarios: token de usuario, id del doc, titulo, 
//  Observaciones:

//Get necesita el id del document
app.get("/document", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.body.id) } },
        function (err, result) {
            if (!result) {
                response.status(404).send("Document does not exist");
            } else {
                response.status(200).send(result);
            }
        })

});

// Post necesita los campos del document en el body de la request
// ***** Habrá que modificarlo, para que reciba el token del usuario e ingrese en el array de users ese id
//       además, habrá que coger la template y copiarla y meterla en la propiedad template del document
app.post("/document", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").insertOne(request.body, function (err, res) {
        if (!res) {
            response.status(500).send("Unexpected error. Could not create new document.");
        } else {
            response.status(200).send("document registered correctly.");
        }
    })
});

//Aqui habría que chequear que el usuario que está modificando el document sea uno de los que tienen el doc asignado
app.put("/document", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").updateOne(
        { _id: { $eq: ObjectId(request.body.id) } },
        { $set: request.body },
        function (err, res) {
            if (!res) {
                response.status(404).send("document does not exist")
            } else {
                response.status(200).send("document updated successfully")
            }
        })
});

app.delete("/document", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");
    if (!authorization) {
        response.status(401).send("authorization required");
    } else {
        if (isAdmin(authorization)) {

            await database.collection("documents").deleteOne(
                { _id: { $eq: ObjectId(request.body.id) } },
                function (err, res) {
                    if (!res) {
                        response.status(404).send("document does not exist")
                    } else {
                        response.status(200).send("document deleted successfully")
                    }
                })
        } else {
            response.status(403).send("User not authorized");
        }
    }
});

//  Endpoint para: listar todos los documents de un usuario
//  Parametros necesarios:  id del usuario
//  Observaciones:

app.get("/listdocumentsuser", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").find({ users: request.body.id }).toArray((err, results) => {
        if (!results) {
            response.status(404).send("No documents assigned to user")
        } else {
            response.status(200).send(results);
        }
    });
});

//  Endpoint para: listar las templates    
//  Parametros necesarios: 
//  Observaciones:

app.get("/listalltemplates", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("templates").find().toArray((err, res) => {
        if (!res) {
            response.status(404).send("There is no templates")
        } else {
            response.status(200).send(res);
        }
    });
});

//  Endpoint para: asignar un usuario a un document (admin)
//  Parametros necesarios: id user, id document
//  Observaciones:

app.put("/assignuser", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {

        response.status(401).send("Authorization required");

    } else {

        if (isAdmin(authorization)) {

            await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.body.idDocument) } },
                function (err, result) {
                    if (!result) {
                        response.status(404).send("document does not exist");
                    } else {
                        let aux = result;

                        aux.users.push(request.body.idUser);

                        database.collection("documents").updateOne(
                            { _id: { $eq: ObjectId(request.body.idDocument) } },
                            { $set: aux },
                            function (err, res) {
                                response.status(200).send("User assigned successfully")
                            })
                    }
                })
        } else {
            response.status(403).send("User not authorized");
        }
    }
});

//  Endpoint para: modificar state del document a "para revisar"
//  Parametros necesarios: id del document
//  Observaciones:

app.put("/statelookover", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.body.idDocument) } },
        function (error, result) {
            if (!result) {
                response.status(404).send("document does not exist");
            } else {
                let aux = result;

                aux.state="Para revisar";

                database.collection("documents").updateOne(
                    { _id: { $eq: ObjectId(request.body.idDocument) } },
                    { $set: aux },
                    function (err, res) {
                        response.status(200).send("document updated successfully")
                    })
            }
        })
});

//  Endpoint para: cambiar el state de un document a "aprobado"
//  Parametros necesarios: token del usuario, id del document
//  Observaciones: sólo el admin puede hacer ésto

app.put("/stateapproved", async function (request, response){

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {

        response.status(401).send("Authorization required");

    } else {

        if (isAdmin(authorization)) {

            await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.body.idDocument) } },
                function (err, result) {
                    if (!result) {
                        response.status(404).send("document does not exist");
                    } else {
                        let aux = result;

                        aux.state="Aprobado";

                        database.collection("documents").updateOne(
                            { _id: { $eq: ObjectId(request.body.idDocument) } },
                            { $set: aux },
                            function (err, res) {
                                response.status(200).send("document updated successfully")
                            })
                    }
                })
        } else {
            response.status(403).send("User not authorized");
        }
    }
});

//  Endpoint para: CRUD de cláusulas de las templates
//  Parametros necesarios:  token identificación usuario, id de la template,  body de la template (titulo, texto, valores a rellenar)
//  Observaciones: 
//      - en principio tenia pensado poder añadir las clausulas en el momento de la creación de la template
//      pero creo que es mejor (más fácil por ahora) añadirlas una a una cuando la template ya está creada.

// Necesita idtemplate y el body de la clausula (titulo, texto, valores a rellenar[])
// app.post("/clausula", async function (request, response){

//     let database = db.db("bdabledocs");

//     const authorization = request.get("authorization");

//     if (!authorization) {

//         response.status(401).send("Autorización requerida");

//     } else {

//         if (isAdmin(authorization)) {

//             await database.collection("templates").findOne({ _id: { $eq: ObjectId(request.body.idtemplate) } },
//                 function (err, result) {
//                     if (!result) {
//                         response.status(404).send("template no existe");
//                     } else {

//                         let aux = result;

//                         let nuevaClausula = {
//                             titulo: request.body.titulo,
//                             texto: request.body.texto,
//                             valores: request.body.valores
//                         }

//                         aux.clausulas.push(nuevaClausula);
                    
                        
//                     }
//                 })
//             }
//         }
// });

// app.put("/clausula", async function (request, response){

//     let database = db.db("bdabledocs");
// });

// app.delete("/clausula", async function (request, response){

//     let database = db.db("bdabledocs");
// });


// ** NOTA ** Un endpoint es la URL o ruta, pero puede tener distintos métodos (get, post, put, delete) con distintas
//            funciones cada uno y distintas respuestas. Eso lo maneja ya el front cuando hace la llamada a la API


//  Endpoint para:
//  Parametros necesarios:
//  Observaciones:

// app.post("/", async function (request, response){

//     let database = db.db("bdabledocs");
// });
