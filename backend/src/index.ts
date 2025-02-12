import 'module-alias/register';
import Fastify from "fastify";
import cors from "@fastify/cors";
import productRoutes from "./routes/products";
import adjustmentRoutes from "./routes/adjustments";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

// Enable CORS (Required for frontend communication)
fastify.register(cors, {
  origin: "*", // Adjust this to your frontend URL in production
});

// Register product routes
fastify.register(productRoutes, { prefix: "/api" });

// Register adjustment routes
fastify.register(adjustmentRoutes, { prefix: "/api" });

const PORT = process.env.PORT || 3009;
const DB_HOST = process.env.DB_HOST || "localhost";

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`🚀 Server running at http://${DB_HOST}:${PORT}`);

    fetch(`http://${DB_HOST}:${PORT}/api/fetch-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
  } catch (err) {
    console.error(err);
    process.exit(1); // Prevents silent crashes
  }
};

start();
