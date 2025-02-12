import { FastifyInstance } from "fastify";
import db from "@/db";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  thumbnail: string;
}

interface ApiResponse {
  products: Product[];
}

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/all-products", async (request, reply) => {
    try {
      const products = await db.any("SELECT * FROM products ORDER BY id");
      return reply.code(201).send({ data: products });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.get("/products", async (request, reply) => {
    try {
      const { page = 1, limit = 8 } = request.query as { page: number; limit: number };
      const offset = (page - 1) * limit;

      const products = await db.any("SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2", [limit, offset]);
      return reply.code(201).send({ data: products });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.get("/products/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const product = await db.oneOrNone("SELECT * FROM products WHERE id = $1", [id]);
      if (!product) return reply.code(404).send({ error: "Product not found" });
      return reply.code(201).send(product);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.post("/products", async (request, reply) => {
    try {
      const { title, description, price, sku, image } = request.body as { title: string; description: string; price: number; sku: string; image: string };
      const product = await db.one(
          "INSERT INTO products (title, description, price, sku, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [title, description, price, sku, image]
      );
      return reply.code(201).send(product);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.put("/products/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { title, description, price, sku, image } = request.body as { title: string; description: string; price: number; sku: string; image: string };
      await db.none(
          "UPDATE products SET title=$1, description=$2, price=$3, sku=$4, image=$5 WHERE id=$6",
          [title, description, price, sku, image, id]
      );
      return reply.code(201).send({ success: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.delete("/products/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: number };
      await db.none("DELETE FROM products WHERE id = $1", [id]);
      return reply.code(201).send({ success: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  fastify.get("/fetch-products", async (request, reply) => {
    try {
      const response = await axios.get<ApiResponse>("https://dummyjson.com/products?limit=1000");
      const products = response.data.products;

      if (!products || !Array.isArray(products)) {
        return reply.code(400).send({ error: "Invalid products data" });
      }

      let addedCount = 0;

      for (const product of products) {
        await db.none(
          `INSERT INTO products (title, description, price, stock, sku, image) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (sku) DO NOTHING`,
          [
            product.title,
            product.description || "No description available",
            product.price || 0,
            product.stock ?? 0,
            String(product.sku),
            product.thumbnail || null,
          ]
        );

        addedCount++;
      }

      return reply.code(201).send({ message: `Added ${addedCount} new products` });
    } catch (error) {
      console.error("Error fetching products:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  });
}

