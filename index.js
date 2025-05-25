import express from 'express';
import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(express.json());
try {
    const client = new MongoClient(URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      
      await client.connect();
      const db = client.db('sample_mflix');
      app.get('/', async (req, res) => {
        const ok = db.collection("movies").find({}).toArray()
        .then((result)=>{
            console.log(result);
            
            
        });
        res.send(ok);
        
      });
      app.get('/usuarios', async (req, res) => {
        try {
          const usuarios = await db.collection('users').find({}).toArray(); // sin filtro
          res.json(usuarios); // devuelve todo
        } catch (err) {
          console.error('❌ Error al obtener usuarios:', err);
          res.status(500).json({ error: 'Error al obtener usuarios' });
        }
      });
      app.post('/insertarUsuario', async (req, res) => {
        try {
          const nuevoUsuario =req.body;
          const resultado = await db.collection('users').insertOne(nuevoUsuario);
          res.json({mensaje:"usuario insertado", id:resultado.insertedId}).status(201); // devuelve todo
        } catch (err) {
          console.error('❌ Error al obtener usuarios:', err);
          res.status(500).json({ error: 'Error al obtener usuarios' });
        }
      });
      app.post("/obtenerUsuarioByEmail", async (req, res) => {
        try{
          const {email}= req.body;
          const response = await db.collection('users').findOne({email: email});
          if (!response) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }else{
            res.send(response).status(200);
          }
          
          

        }catch (error) {
          console.error('❌ Error al obtener usuario por email:', error);
          res.status(500).json({ error: 'Error al obtener usuario por email' });
      }});
      app.delete("/eliminarUsuario", async (req, res) => {
        try{
          const {email}= req.body;
          const response = await db.collection('users').deleteOne({email: email});
          console.log(response); 
          if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }else{
            return res.status(200).json({ mensaje: 'Usuario eliminado' });
          }
        }
          catch (error) {
          console.error('❌ Error al eliminar usuario:', error);  
          }
        });
      app.put("/actualizarUsuario", async (req, res) => {
        try{
          const {email, ...actualizaciones}= req.body;
          const response = await db.collection('users').updateOne({email: email}, {$set: actualizaciones});
          console.log(response);
          if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }else{
            return res.status(200).json({ mensaje: 'Usuario actualizado' });
          }
        }
          catch (error) {
          console.error('❌ Error al actualizar usuario:', error);  
          }
        });
      app.listen(3000, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      });
      
      
    
} catch (error) {
    console.error('Error loading environment variables:', error);
}
  


