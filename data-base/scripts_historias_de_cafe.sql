--Creación de la base de datos
CREATE DATABASE "ecommerce-café-db"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

--Creacion de la tabla users
CREATE TABLE users (
    id_user SERIAL NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    creation_date TIMESTAMPTZ DEFAULT NOW(),
    state_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'cliente',
    CONSTRAINT users_pkey PRIMARY KEY (id_user),
	CONSTRAINT users_email_key UNIQUE (email) 
);
--Creacion de la tabla categories
CREATE TABLE categories (
    id_categorie SERIAL NOT NULL,
    toasting_type VARCHAR(50) NOT NULL,
    region_origin VARCHAR(100) NOT NULL,
    presentation VARCHAR(50) NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id_categorie),
	CONSTRAINT categories_toasting_type_check CHECK (toasting_type IN ('Tostado Claro','Tostado Medio','Tostado Oscuro')),
	CONSTRAINT categories_region_origin_check CHECK (region_origin IN ('Antioquia','Boyacá','Caldas','Cauca','Cesar - Guajira',
	'Cundinamarca','Huila','Magdalena','Nariño','Norte de Santander','Quindío','Risaralda','Santander','Tolima','Valle del Cauca')),
	CONSTRAINT categories_presentation_check CHECK (presentation IN ('Molido','Grano'))
);

--Creacion de la tabla products
CREATE TABLE products (
    id_product SERIAL NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(150) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock INTEGER NOT NULL,
	categorie_id INTEGER NOT NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id_product),
	CONSTRAINT products_stock_check CHECK (stock >= 0),
	CONSTRAINT products_categories_fk FOREIGN KEY (categorie_id)
	REFERENCES categories(id_categorie) ON DELETE RESTRICT
);
--Creacion de la tabla orders
CREATE TABLE orders (
    id_order SERIAL NOT NULL,
	state_order VARCHAR(50) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
	total DECIMAL(10,2) NOT NULL,
	order_date TIMESTAMPTZ DEFAULT NOW(),
	user_id INTEGER NOT NULL,
	CONSTRAINT orders_pkey PRIMARY KEY (id_order),
	CONSTRAINT orders_state_order_check CHECK (state_order IN ('En proceso','Pendiente Entrega','Entregado','Cancelado')),
	CONSTRAINT orders_users_fk FOREIGN KEY (user_id)
	REFERENCES users(id_user) ON DELETE RESTRICT
);
--Creacion de la tabla details
CREATE TABLE details (
    id_detail SERIAL NOT NULL,
	queantity_products INTEGER NOT NULL,
	order_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	CONSTRAINT details_pkey PRIMARY KEY (id_detail),
	CONSTRAINT details_orders_fk FOREIGN KEY (order_id)
	REFERENCES orders(id_order) ON DELETE RESTRICT,
	CONSTRAINT details_products_fk FOREIGN KEY (product_id) 
	REFERENCES products(id_product) ON DELETE RESTRICT
);
--Creacion de la tabla payments
CREATE TABLE payments (
    id_payment SERIAL NOT NULL,
	transaction_number VARCHAR(100) NOT NULL,
	transaction_date TIMESTAMPTZ DEFAULT NOW(),
	transaction_status VARCHAR(100) NOT NULL,
	order_id INTEGER NOT NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id_payment),
	CONSTRAINT payments_transaction_number_key UNIQUE (transaction_number) ,
	CONSTRAINT payments_transaction_number_check  CHECK (transaction_number ~ '^[A-Za-z0-9\-_\.]+$'),
	CONSTRAINT payments_transaction_status_check CHECK (transaction_status IN ('Aprobado','En proceso','Rechazado','Cancelado')),
	CONSTRAINT payments_orders_fk FOREIGN KEY (order_id)
	REFERENCES orders(id_order) ON DELETE RESTRICT
);
--Colocamos la llave forenea como unique para aplicar la relacion de 1 a 1 
ALTER TABLE payments ADD CONSTRAINT payments_order_id_uq UNIQUE (order_id);

--Insercion de datos en la tabla users
INSERT INTO users (name, email, password_hash, state_active, role) VALUES
('Carlos Medina',    'carlos.medina@gmail.com',   '$2b$12$KIXabc123hashedpass1', TRUE,  'cliente'),
('Laura Ospina',     'laura.ospina@gmail.com',    '$2b$12$KIXabc123hashedpass2', TRUE,  'cliente'),
('Andrés Restrepo',  'andres.restrepo@gmail.com', '$2b$12$KIXabc123hashedpass3', TRUE,  'admin'),
('María Fernández',  'maria.fernandez@gmail.com', '$2b$12$KIXabc123hashedpass4', TRUE,  'cliente'),
('Felipe Torres',    'felipe.torres@gmail.com',   '$2b$12$KIXabc123hashedpass5', FALSE, 'cliente');
 
SELECT * FROM users;
--Insercion de datos en la tabla categories
INSERT INTO categories (toasting_type, region_origin, presentation) VALUES
('Tostado Claro',  'Huila',      'Molido'),
('Tostado Medio',  'Antioquia',  'Grano'),
('Tostado Oscuro', 'Nariño',     'Molido'),
('Tostado Medio',  'Cauca',      'Grano'),
('Tostado Claro',  'Risaralda',  'Molido');

SELECT * FROM categories;

--Insercion de datos en la tabla products
INSERT INTO products (name, description, price, stock, categorie_id) VALUES
('Café Huila Especial',       'Notas de panela y frutas rojas, acidez suave',   35000.00, 120, 1),
('Café Antioqueño Premium',   'Cuerpo medio, notas de chocolate y nuez',        28000.00,  85, 2),
('Café Nariño Intenso',       'Tostado oscuro, amargo equilibrado, cuerpo alto', 32000.00,  60, 3),
('Café del Cauca Orgánico',   'Certificado orgánico, notas florales y cítricas', 42000.00,  40, 4),
('Café Risaralda Suave',      'Perfil suave, ideal para preparación en frío',   30000.00,  75, 5);

SELECT * FROM products;
--Insercion de datos en la tabla orders
INSERT INTO orders (state_order, subtotal, total, user_id) VALUES
('Entregado',         35000.00, 39900.00, 1),
('Pendiente Entrega', 56000.00, 61600.00, 2),
('En proceso',        42000.00, 47460.00, 4),
('Cancelado',         28000.00, 31640.00, 1),
('Entregado',         62000.00, 69060.00, 2);

SELECT * FROM orders;
--Insercion de datos en la tabla details
INSERT INTO details (quantity_products, order_id, product_id) VALUES
(1, 1, 1),
(2, 2, 2),
(1, 3, 4),
(1, 4, 2),
(2, 5, 5);

SELECT * FROM details;
--Insercion de datos en la tabla payments
INSERT INTO payments (transaction_number, transaction_status, order_id) VALUES
('TXN-2024-00001', 'Aprobado',   1),
('TXN-2024-00002', 'En proceso', 2),
('TXN-2024-00003', 'En proceso', 3),
('TXN-2024-00004', 'Cancelado',  4),
('TXN-2024-00005', 'Aprobado',   5);
SELECT * FROM payments;
