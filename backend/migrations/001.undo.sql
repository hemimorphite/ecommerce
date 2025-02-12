DROP TRIGGER IF EXISTS trigger_update_stock ON adjustments;

DROP FUNCTION IF EXISTS update_stock();

DROP TABLE IF EXISTS adjustments CASCADE;
DROP TABLE IF EXISTS products CASCADE;
