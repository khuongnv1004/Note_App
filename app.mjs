import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import fakeData from "./fakeData/index.js";
import mongoose from "mongoose";
import { resolvers } from "./src/v1/resolvers/index.js";
import { typeDefs } from "./src/v1/schema/index.js";
import './firebaseConfig.js'
import {getAuth} from 'firebase-admin/auth'
const app = express();
dotenv.config();

//init dbs
// require('./v1/databases/init.mongodb')
// require('./v1/databases/init.redis')

//user middleware
// app.use(helmet())
// app.use(morgan('combined'))
// // compress responses
// app.use(compression())

// add body-parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//router
// app.use(require('./src/v1/routes/index.router'))

// Error Handling Middleware called

// app.use((req, res, next) => {
//     const error = new Error("Not found");
//     error.status = 404;
//     next(error);
// });

// error handler middleware
// app.use((error, req, res, next) => {
//     res.status(error.status || 500).send({
//         error: {
//             status: error.status || 500,
//             message: error.message || 'Internal Server Error',
//         },
//     });
// });

const { PORT } = process.env;

const httpServer = http.createServer(app);





const URI = process.env.MONGO_URI;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

const authorizationJWT = async (req,res,next) => {
    const authorizationHeader = req.headers.authorization;
    if(authorizationHeader){
      const accessToken = authorizationHeader.split(' ')[1];
       getAuth().verifyIdToken(accessToken).then(decodedToken=>{
        req.uid = decodedToken.uid
        next();
      }).catch(err=>{
        return res.status(403).json({message:'Forbidden'})
      })
    }else{
      return res.status(401).json({message:'Unauthorized'})
    }
}

// const server = app.listen( PORT, () => {
//     console.log(`WSV start with port ${PORT}`);
// })



app.use(cors(),authorizationJWT, bodyParser.json(), expressMiddleware(server, {
  context: async ({req, res})=>{
    console.log(req.uid);
    return {uid: req.uid}
  }
}));
mongoose.set('strictQuery', false);
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async ()=>{
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`WSV start with port ${PORT}`);
})



// process.on('SIGINT', () => {
//     server.close( () => console.log(`exits server express`))
// })
