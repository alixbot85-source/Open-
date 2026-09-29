PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER','ADMIN')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  legacy_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('resource','server')),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL CHECK(price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','DRAFT','ARCHIVED')),
  metadata TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  public INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payment_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  tron_address TEXT,
  usdt_trc20_address TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_snapshot TEXT NOT NULL,
  type TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'PAYMENT_REVIEW',
  payment_currency TEXT NOT NULL,
  payment_wallet TEXT NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  configuration TEXT NOT NULL DEFAULT '{}',
  delivery_data TEXT,
  payment_submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED','DELIVERED','FAILED','CANCELLED')),
  attempts INTEGER NOT NULL DEFAULT 0,
  provider_id TEXT,
  last_error TEXT,
  scheduled_for TEXT NOT NULL,
  delivered_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  provider_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  order_id INTEGER,
  user_id INTEGER,
  actor TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_type_legacy ON products(type,legacy_id);
CREATE INDEX IF NOT EXISTS idx_products_type_status ON products(type,status,sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status,scheduled_for);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

INSERT OR IGNORE INTO products(slug,legacy_id,type,name,description,price,metadata,sort_order) VALUES
('country-resource-starter',1,'resource','Country Resource Starter','Structured digital reference collection in practical formats.',299,'{"country":"Global","formats":["PDF","XLSX","JSON"]}',10),
('country-resource-professional',2,'resource','Country Resource Professional','Expanded country-organized collection for internal research workflows.',549,'{"country":"Global","formats":["PDF","XLSX","JSON"]}',20),
('country-resource-complete',3,'resource','Country Resource Complete','Complete digital bundle with all currently listed formats.',999,'{"country":"Global","formats":["PDF","XLSX","JSON"]}',30),
('managed-server-standard',1,'server','Managed Server Standard','Configurable infrastructure resource with reviewed fulfillment.',156,'{"cpu":"8 vCPU","ram":"32 GB","storage":"500 GB NVMe","bandwidth":"10 Gbps"}',10),
('managed-server-business',2,'server','Managed Server Business','Higher-capacity infrastructure package for modern workloads.',250,'{"cpu":"16 vCPU","ram":"64 GB","storage":"1 TB NVMe","bandwidth":"10 Gbps"}',20),
('managed-server-scale',3,'server','Managed Server Scale','Advanced configurable infrastructure package.',350,'{"cpu":"24 vCPU","ram":"128 GB","storage":"2 TB NVMe","bandwidth":"20 Gbps"}',30);
INSERT OR REPLACE INTO payment_settings(id,tron_address,usdt_trc20_address,updated_at) VALUES
(1,'TGkSu19kCRFtZSWzZHduUcgESqcWQdfD6X','TGkSu19kCRFtZSWzZHduUcgESqcWQdfD6X',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO site_settings(key,value,public) VALUES
('storefront', '{"resourceFirst":true,"manualReview":true,"deliveryEstimate":"2–10 hours"}', 1);
