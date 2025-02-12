import Fastify from "fastify";
import adjustmentRoutes from "@/routes/adjustments"; 
import supertest from "supertest";
import db from "@/db"; 

jest.mock("@/db", () => ({
  any: jest.fn() as jest.Mock,
  oneOrNone: jest.fn() as jest.Mock,
  none: jest.fn() as jest.Mock,
  one: jest.fn() as jest.Mock,
  result: jest.fn() as jest.Mock,
}));

const fastify = Fastify();
fastify.register(adjustmentRoutes);

describe("Adjustment Routes", () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterAll(() => {
    fastify.close();
  });

  it("POST /adjustments should create an adjustment", async () => {
    (db.one as jest.Mock).mockResolvedValue({
      id: 1,
      product_id: 1,
      quantity: 5,
    });

    const response = await supertest(fastify.server)
      .post("/adjustments")
      .send({ product_id: 1, quantity: 5 });

    expect(response.status).toBe(201);
    expect(response.body.product_id).toBe(1);
    expect(response.body.quantity).toBe(5);
  });

  it("GET /adjustments should return adjustments", async () => {
    (db.any as jest.Mock).mockResolvedValue([
      { id: 1, product_id: 1, quantity: 5, sku: "ABC123", title: "Product A", image: "image.png" },
    ]);
    (db.one as jest.Mock).mockResolvedValue({ count: "1" });

    const response = await supertest(fastify.server).get("/adjustments?page=1&limit=10");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].sku).toBe("ABC123");
  });

  it("PUT /adjustments/:id should update an adjustment", async () => {
    (db.result as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await supertest(fastify.server)
      .put("/adjustments/1")
      .send({ product_id: 1, quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("DELETE /adjustments/:id should delete an adjustment", async () => {
    (db.result as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await supertest(fastify.server).delete("/adjustments/1");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("DELETE /adjustments/:id should return 404 if adjustment not found", async () => {
    (db.result as jest.Mock).mockResolvedValue({ rowCount: 0 });

    const response = await supertest(fastify.server).delete("/adjustments/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Adjustment not found");
  });
});

