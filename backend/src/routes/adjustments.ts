import { FastifyInstance } from "fastify";
import db from "../db";

export default async function adjustmentRoutes(fastify: FastifyInstance) {
  /**
   * Create a new adjustment
   */
  fastify.post("/adjustments", async (request, reply) => {
    const { product_id, quantity } = request.body as { product_id: number; quantity: number };

    if (!product_id || quantity === undefined) {
      return reply.code(400).send({ error: "Missing product_id or quantity" });
    }

    try {
      const adjustment = await db.one(
        "INSERT INTO adjustments (product_id, quantity) VALUES ($1, $2) RETURNING *",
        [product_id, quantity]
      );
      return reply.code(201).send(adjustment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  /**
   * Get all adjustments (with pagination & product details)
   */
  fastify.get("/adjustments", async (request, reply) => {
    const { page = "1", limit = "10" } = request.query as { page?: string; limit?: string };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return reply.code(400).send({ error: "Invalid page or limit values" });
    }

    try {
      const adjustments = await db.any(
        `WITH counted AS (
          SELECT COUNT(*) AS total_rows FROM adjustments
        )
        SELECT 
          ROW_NUMBER() OVER (ORDER BY a.id DESC) AS no,
          a.id,
          a.product_id,
          a.quantity,
          p.sku,
          p.title,
          p.image
        FROM adjustments a
        JOIN products p ON a.product_id = p.id
        ORDER BY a.id DESC
        LIMIT $1 OFFSET $2`,
        [limitNum, offset]
      );

      const total = await db.one(
        "SELECT COUNT(*) FROM adjustments",
        [],
        (row: { count: string }) => Number(row.count)
      );
      

      return reply.send({
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
        data: adjustments,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: error });
    }
  });

  /**
   * Update an adjustment
   */
  fastify.put("/adjustments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { product_id, quantity } = request.body as { product_id: number; quantity: number };

    if (!product_id || quantity === undefined) {
      return reply.code(400).send({ error: "Missing product_id or quantity" });
    }

    try {
      const result = await db.result(
        "UPDATE adjustments SET product_id = $1, quantity = $2 WHERE id = $3",
        [product_id, quantity, id]
      );

      if (result.rowCount === 0) {
        return reply.code(404).send({ error: "Adjustment not found" });
      }

      return reply.send({ success: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to update adjustment" });
    }
  });

  /**
   * Delete an adjustment
   */
  fastify.delete("/adjustments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await db.result("DELETE FROM adjustments WHERE id = $1", [id]);

      if (result.rowCount === 0) {
        return reply.code(404).send({ error: "Adjustment not found" });
      }

      return reply.send({ success: true });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to delete adjustment" });
    }
  });
}

