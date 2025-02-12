-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE NOT NULL
);

-- Create adjustment transactions table
CREATE TABLE adjustments (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION update_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- If deleting, subtract the old quantity from stock
    IF TG_OP = 'DELETE' THEN
        UPDATE products
        SET stock = stock - OLD.quantity
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;

    -- If updating, first revert the old quantity before applying the new one
    IF TG_OP = 'UPDATE' THEN
        UPDATE products
        SET stock = stock - OLD.quantity
        WHERE id = OLD.product_id;
    END IF;

    -- Apply the new quantity adjustment (for INSERT and UPDATE)
    UPDATE products
    SET stock = stock + NEW.quantity
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to adjustments table for INSERT, UPDATE, and DELETE
CREATE OR REPLACE TRIGGER trigger_update_stock
AFTER INSERT OR UPDATE OR DELETE ON adjustments
FOR EACH ROW EXECUTE FUNCTION update_stock();
