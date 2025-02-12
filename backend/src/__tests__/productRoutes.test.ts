import Fastify from "fastify";
import productRoutes from "@/routes/products";
import db from "@/db";
import supertest from "supertest";

jest.mock("@/db", () => ({
  any: jest.fn() as jest.Mock,
  oneOrNone: jest.fn() as jest.Mock,
  none: jest.fn() as jest.Mock,
  one: jest.fn() as jest.Mock,
}));

const fastify = Fastify(); 
fastify.register(productRoutes);

describe("Product Routes", () => {
  beforeAll(async () => {
    await fastify.ready(); 
  });

  afterAll(() => {
    fastify.close(); 
  });

it("GET /all-products should return all products", async () => {
  (db.any as jest.Mock).mockResolvedValue([{ id: 1, title: "Test Product", price: 100 }]);

  const response = await supertest(fastify.server).get("/all-products");

  expect(response.status).toBe(201);
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0].title).toBe("Test Product");
});

it("GET /products/:id should return a product by ID", async () => {
  (db.oneOrNone as jest.Mock).mockResolvedValue({ id: 1, title: "Test Product", price: 100 });

  const response = await supertest(fastify.server).get("/products/1");

  expect(response.status).toBe(201);
  expect(response.body.title).toBe("Test Product");
});

it("POST /products should create a product", async () => {
  (db.one as jest.Mock).mockResolvedValue({
    id: 1,
    title: "New Product",
    description: "A great product",
    price: 50,
    sku: "SKU123",
    image: "image.png",
  });

  const response = await supertest(fastify.server)
    .post("/products")
    .send({
      title: "New Product",
      description: "A great product",
      price: 50,
      sku: "SKU123",
      image: "image.png",
    });

  expect(response.status).toBe(201);
  expect(response.body.title).toBe("New Product");
});

it("PUT /products/:id should update a product", async () => {
  (db.none as jest.Mock).mockResolvedValue(undefined);

  const response = await supertest(fastify.server)
    .put("/products/1")
    .send({
      title: "Updated Product",
      description: "Updated description",
      price: 75,
      sku: "SKU123",
      image: "updated.png",
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});

it("DELETE /products/:id should delete a product", async () => {
  (db.none as jest.Mock).mockResolvedValue(undefined);

  const response = await supertest(fastify.server).delete("/products/1");

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});

it("GET /fetch-products should fetch and insert products from DummyJSON", async () => {
  const mockProducts = [
    { id: 1, title: "Fetched Product", description: "From API", price: 100, stock: 10, sku: "FETCH1", thumbnail: "image.jpg" },
  ];

  jest.mock("axios", () => ({
    get: jest.fn().mockResolvedValue({ data: { products: mockProducts } }),
  }));

  (db.none as jest.Mock).mockResolvedValue(undefined);

  const response = await supertest(fastify.server).get("/fetch-products");

  expect(response.status).toBe(201);
  expect(response.body.message).toContain("Added");
});

});

