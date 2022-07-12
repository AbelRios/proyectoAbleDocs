const { response } = require('express');
const express = require('express');
const cors = require("cors");
const { ObjectId } = require("mongodb");
const md5 = require("nodejs-md5");
const jwt = require('jsonwebtoken');
const app = express();
let uniqid = require('uniqid'); 
app.use(cors());
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

class Notification {
    constructor(from, message){
        this.id= uniqid();
        this.from = from;
        this.message = message;
        this.date = createDate();
    }
}

const baseNotification = new Notification("Equipo de AbleDocs", 
    "Bienvenido a AbleDocs, tu programa de edición de contratos de confianza.");

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

//  Función para crear una fecha en string

function createDate(){

    let date =new Date();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return(`${day}/${month}/${year} a las ${hours}:${minutes}`)

}

// Función que desencripta el token y devuelve el id del usuario
function idToken(token) {

    const decoded = jwt.verify(token, "releevant");

    return decoded.id;
}

// Función que clona un objeto (template)
function deepClone(object){
    let clone = {};
    for (let key in object){
        let value = object[key];
        if(typeof value != 'object') {
            clone[key] = value;
        } else {
            clone[key] = deepClone(value);
        }
    }
    return clone;
}

//  <------------- Endpoints de la API ------------->

//  Endpoint para: creación de nuevo usuario
//  Parametros necesarios: name, email, password
//  Observaciones: 
//      Asignamos directamente el rol a "usuario" hardcodeado

app.post("/newuser", async function (request, response) {

    let database = db.db("bdabledocs");

    request.body.roles = [1984];
    request.body.notifications = [baseNotification];

    let auxname = request.body.name.replace(/ /g,"+");
    request.body.avatar = `https://i.pravatar.cc/150?u=${auxname}`;


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

//  Endpoint para: GET de un usuario
//  Parametros necesarios:  id del usuario por params
//  Observaciones:

app.get("/user/:id", async function (request, response){

    let database = db.db("bdabledocs");

    await database.collection("users").findOne({_id: {$eq: ObjectId(request.params.id)}}, async function (err, result) {
        if (!result) {
            response.status(404).send("User does not exist.");
        } else {
            response.status(200).send(result);
        }
    })
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

//  Endpoint para: PUT de un usuario
//  Parametros necesarios:  id del usuario por params, datos del usuario por el body
//  Observaciones:

app.put("/user/:id", async function (request, response){

    let database = db.db("bdabledocs");

    if(request.body.password){  

        md5.string.quiet(request.body.password, async function (err, md5) {
            if (err) {
             console.log(err);
            } else {
                request.body.password = md5;
            }
        })
    }

    await database.collection("users").updateOne({_id: {$eq: ObjectId(request.params.id)}},{ $set: request.body }, 
        async function (err, result) {
        if (!result) {
            response.status(404).send("User does not exist.");
        } else {
            database.collection("users").findOne({ _id: { $eq: ObjectId(request.params.id) } },
                function (err, result) {
                    if (!result) {
                        response.status(404).send("User does not exist.");
                    } else {
                            const accessToken = jwt.sign({ id: result._id, name: result.name, 
                                roles: result.roles, email: result.email, notifications: result.notifications, avatar:result.avatar }, 
                                "releevant", { expiresIn: '6h' });

                            let token = {token: accessToken};
                            response.status(200).send(token);
                            
                    }
                }
            )
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

                            const accessToken = jwt.sign({ id: result._id, name: result.name, 
                                roles: result.roles, email: result.email, notifications: result.notifications, avatar:result.avatar }, 
                                "releevant", { expiresIn: '6h' });

                            let token = {token: accessToken};
                            response.status(200).send(token);
                            
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

//  Endpoint para cambiar el rol de un usuario a administrador

app.put("/useradmin/:id", async function (request, response){

    let aux = {
        roles: [1990,1984]
    }

    let database = db.db("bdabledocs");

    await database.collection("users").updateOne(
        { _id: { $eq: ObjectId(request.params.id) } },
        { $set: aux },
        function (err, res) {
            if (!res) {
                response.status(404).send("user does not exist")
            } else {
                response.status(200).send("user modified successfully")
            }
        }
    )
})



//  Endpoint para: Obtener/Crear/Modificar/Eliminar una template
//  Parametros necesarios: Objeto template (id, titulo, texto, valores a rellenar, clausulas)
//  Observaciones: ten en cuenta que los datos los recoge el front, aquí debe llegar todos los datos y tendremos que 
//  asegurarnos de que NO nos vienen campos necesarios vacíos. 
//  No vamos a tener que llamar al 'crearnuevaclausula' puesto que esos datos ya vienen del front.
//  OJO: el put me genera un segundo campo id en el objeto template, podría solucionarse pasando el id por params en lugar de por el body.

// El get necesita pasarle el id de la template
app.get("/template/:id", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("templates").findOne({ _id: { $eq: ObjectId(request.params.id)}}, function (err, result) {
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

// Put necesita en el body los datos a modificar + por params el id de la template
app.put("/template/:id", async function (request, response) {

    let database = db.db("bdabledocs");

    const authorization = request.get("authorization");

    if (!authorization) {
        response.status(401).send("Authorization required");
    } else {

        if (isAdmin(authorization)) {

            await database.collection("templates").updateOne(
                { _id: { $eq: ObjectId(request.params.id) } },
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

//Get necesita el id del document por params
app.get("/document/:id", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.params.id) } },
        function (err, result) {
            if (!result) {
                response.status(404).send("Document does not exist");
            } else {
                response.status(200).send(result);
            }
        })

});

// Post necesita en el body: 
    // users:un array con el id del usuario, 
    // title: string del titulo del documento,
    // type: string con el tipo de documento/template
    // valores: objeto con los valores de las variables del contrato,
    // lables: objeto con los placeholders/lables del contrato,
    // lastUpdated: fecha de última modificación

app.post("/document", async function (request, response) {

    // Inicialización del body para crear el Nuevo Documento
    request.body.users.push("62c6d73f202a1593cbb40232");  
    request.body.lastUpdated = createDate();
    if(request.body.title ===""){
        request.body.title = "Documento sin titulo"
    }

    let database = db.db("bdabledocs");

    await database.collection("documents").insertOne(request.body, function (err, res) {
        if (!res) {
            response.status(500).send("Unexpected error. Could not create new document.");
        } else {
            response.status(200).send("document registered correctly.");
        }
    })
});

//  Este put necesita por el body los datos del documento y por params la id del documento
//  Aqui habría que chequear que el usuario que está modificando el document sea uno de los que tienen el doc asignado
app.put("/document/:id", async function (request, response) {

    let database = db.db("bdabledocs");

    request.body.lastUpdated = createDate();

    await database.collection("documents").updateOne(
        { _id: { $eq: ObjectId(request.params.id) } },
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

        await database.collection("documents").deleteOne(
            { _id: { $eq: ObjectId(request.body.id) } },
            function (err, res) {
                if (!res) {
                    response.status(404).send("document does not exist")
                } else {
                    response.status(200).send("document deleted successfully")
                }
            })
});

//  Endpoint para: listar todos los documents de un usuario
//  Parametros necesarios:  id del usuario
//  Observaciones:

app.get("/listdocumentsuser/:id", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").find({ users: request.params.id }).toArray((err, results) => {
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
//  Parametros necesarios: id user, id document en el body
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
//  Parametros necesarios: id del document (idDocument), name del usuario (username) y nombre (docname) en el body
//  Observaciones:

app.put("/statelookover", async function (request, response) {

    let database = db.db("bdabledocs");

    await database.collection("documents").findOne({ _id: { $eq: ObjectId(request.body.idDocument) } },
        function (error, result) {
            if (!result) {
                response.status(404).send("document does not exist");
            } else {
                let aux = result; //Aquí tenemos el documento que buscamos en la variable auxiliar

                let notification = new Notification(request.body.username,
                    `El documento ${request.body.docname} ha sido enviado a revisar.`)

                // Aquí introducimos la notificacion nueva en todos los usuarios asignados al document
                aux.users.forEach(element => {
                    database.collection("users").findOne({_id: {$eq: ObjectId(element)}},
                    function(er,res) {
                        if(res){
                        let userAux = res;
                        userAux.notifications.push(notification);

                        database.collection("users").updateOne({_id: {$eq: ObjectId(element)}}, {$set: userAux},
                        function(error, resu){
                            if(!resu){
                                response.status(400).send("Error en la notificación")
                            }
                        })
                    }
                    })                   
                });
                
                aux.state=2;

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
//  Parametros necesarios: token del usuario en el header id del document + (idDocument), nombre del usuario (username) 
//  y nombre del documento (docname) en el body
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

                        let notification = new Notification(request.body.username,
                            `El documento ${request.body.docname} ha sido aprobado.`)
        
                        // Aquí introducimos la notificacion nueva en todos los usuarios asignados al document
                        aux.users.forEach(element => {
                            database.collection("users").findOne({_id: {$eq: ObjectId(element)}},
                            function(er,res) {
                                if(res){
                                let userAux = res;
                                userAux.notifications.push(notification);
        
                                database.collection("users").updateOne({_id: {$eq: ObjectId(element)}}, {$set: userAux},
                                function(error, resu){
                                    if(!resu){
                                        response.status(400).send("Error en la notificación")
                                    }
                                })
                            }
                            })                   
                        });

                        aux.state=3;

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



// ** NOTA ** Un endpoint es la URL o ruta, pero puede tener distintos métodos (get, post, put, delete) con distintas
//            funciones cada uno y distintas respuestas. Eso lo maneja ya el front cuando hace la llamada a la API


//  Endpoint para:
//  Parametros necesarios:
//  Observaciones:

// app.post("/", async function (request, response){

//     let database = db.db("bdabledocs");
// });
