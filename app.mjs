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

const typeDefs = `#graphql
type Folder {
    id: String,
    name: String,
    createdAt: String,
    author: Author
}

type Author {
    id: String
    name: String
}

type Query {
    folders: [Folder]
}
`;
const resolvers = {
  Query: {
    folders: () => {
      return fakeData.folders ;
    },
  },

  Folder: {
    author: (parent, args) => {
        console.log({parent,args})
        const authorId = parent.authorId;
      return fakeData.author.find(author => author.id === authorId);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// const server = app.listen( PORT, () => {
//     console.log(`WSV start with port ${PORT}`);
// })

await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`WSV start with port ${PORT}`);

// process.on('SIGINT', () => {
//     server.close( () => console.log(`exits server express`))
// })
