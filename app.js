// referenciamos los paquetes instalados y los guardamos en c9onstantes
const express = require('express');
const mysql = require('mysql');
var cors = require('cors');


const app = express();

app.use(express.json()); // notificamos uso de json
app.use(cors());

// configurar conexion de sql
const conexion = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'articulosdb'
});

// probar conexion
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡conexion a la base de datos con exito!");
    }
})

// configurar las rutas
app.get('/', function(req, res){
    res.send('Ruta de inicio');
})


/***  metodos */
//mostrar todos los articulos
app.get('/api/articulos', (req, res)=>{ //invocamos a express
    conexion.query('select * from articulos', (error, filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});
//mostrar un articulo by id
app.get('/api/articulos/:id', (req, res)=>{ //invocamos a express
    conexion.query('select * from articulos where id = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

// insertando articulos
app.post('/api/articulos', (req, res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "insert into articulos set ?";
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

// editar articulos
app.put('/api/articulos/:id', (req, res)=>{
    const id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "update articulos set descripcion = ?, precio= ?, stock=? where id = ?";
    conexion.query(sql,[descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//eliminar articulos
app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query('delete from articulos where id = ?', [req.params.id],(error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }  
    });
});

// creando var de entorno (para ver las var de entorno desde la terminal set)
const puerto = process.env.PUERTO || 3500; // desde la terminat se puede setear el puerto: set PUERTO=7000, pero lo podemos definir como en el ejemplo || 3500

app.listen(puerto, function(){ // puerto y estado de escucha
    console.log("Server OK, en puerto:"+puerto);
}); // para  probarlo en la terminal: node app
