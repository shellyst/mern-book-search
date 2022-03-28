const express = require("express");
const path = require("path");
// Import Apollo server.
const { ApolloServer } = require("apollo-server-express");
// Import Middleware.
const { authMiddleware } = require("./utils/auth");
// Import typeDefs and resolvers.
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Apollo server.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  // Start the Apollo server.
  await server.start();

  // Integrate Apollo server with the Express application as middleware.
  server.applyMiddleware({ app });
};

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Get all.
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
