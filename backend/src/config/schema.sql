CREATE TABLE IF NOT EXISTS addresses (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  cep          VARCHAR(10)  NOT NULL,
  country      VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  city         VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  street       VARCHAR(255) NOT NULL,
  number       VARCHAR(20)  NOT NULL,
  coords       JSON         NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  id          CHAR(36)       NOT NULL PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT           NOT NULL,
  thumb_image VARCHAR(512),
  rating      DECIMAL(3, 2)  NOT NULL DEFAULT 0.00,
  address_id  CHAR(36)       NOT NULL,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_restaurant_address FOREIGN KEY (address_id) REFERENCES addresses (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS dishes (
  id          CHAR(36)       NOT NULL PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT           NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  thumb_image VARCHAR(512),
  prep_time   INT            NOT NULL COMMENT 'Preparation time in minutes',
  allergies   TEXT,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_dishes (
  id            CHAR(36) NOT NULL PRIMARY KEY,
  restaurant_id CHAR(36) NOT NULL,
  dish_id       CHAR(36) NOT NULL,
  on_stock      BOOLEAN  NOT NULL DEFAULT TRUE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rd_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
  CONSTRAINT fk_rd_dish       FOREIGN KEY (dish_id)       REFERENCES dishes (id)       ON DELETE CASCADE,
  CONSTRAINT uq_restaurant_dish UNIQUE (restaurant_id, dish_id)
);

CREATE TABLE IF NOT EXISTS users (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  password     VARCHAR(255) NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_email UNIQUE (email)
);
