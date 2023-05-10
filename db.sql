CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE admins(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname   VARCHAR(255) NOT NULL,
    lastname    VARCHAR(255),
    patronymic  VARCHAR(255),
    email       VARCHAR(256) NOT NULL UNIQUE,
    password    VARCHAR(256) NOT NULL
);

CREATE TABLE permissions(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO permissions (title) VALUES('create_role');
INSERT INTO permissions (title) VALUES('create_employee');
INSERT INTO permissions (title) VALUES('create_erc20_tokens');
INSERT INTO permissions (title) VALUES('create_erc721_tokens');
INSERT INTO permissions (title) VALUES('add_token_admin');
INSERT INTO permissions (title) VALUES('create_user');
INSERT INTO permissions (title) VALUES('create_key');
INSERT INTO permissions (title) VALUES('billing');

CREATE TABLE companies(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(256) NOT NULL,
    email       VARCHAR(256) NOT NULL UNIQUE,
    password    VARCHAR(256) NOT NULL,
    wallet      VARCHAR(42) NOT NULL UNIQUE,
    phone       VARCHAR(18) UNIQUE,
    role_id     INT NOT NULL DEFAULT 0
);

CREATE TABLE employees(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id  UUID REFERENCES companies(id),
    email       VARCHAR(256) NOT NULL UNIQUE,
    password    VARCHAR(256) NOT NULL,
    firstname   VARCHAR(255) NOT NULL,
    lastname    VARCHAR(255),
    patronymic  VARCHAR(255),
    wallet      VARCHAR(42) NOT NULL UNIQUE,
    phone       VARCHAR(18) UNIQUE,
    role_id     INT NOT NULL DEFAULT 0
);

CREATE TABLE roles (
    id          INT NOT NULL,
    company_id  UUID NOT NULL REFERENCES companies(id),
    title       VARCHAR(255) NOT NULL,
    PRIMARY KEY (id, company_id)
);

/*Триггер при добавлении новой роли для компании увеличить roles.id на 1*/
CREATE OR REPLACE FUNCTION set_role_id() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.id := COALESCE((SELECT MAX(id) FROM roles WHERE company_id = NEW.company_id), 0) + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_role_id_trigger
BEFORE INSERT ON roles
FOR EACH ROW
EXECUTE FUNCTION set_role_id();

CREATE TABLE roles_permissions(
    id              INT NOT NULL,
    company_id      UUID NOT NULL REFERENCES companies(id),
    permission_id   INT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY(id, company_id, permission_id)
);

CREATE TABLE users(
    id              UUID UNIQUE DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id),
    firstname       VARCHAR(255) NOT NULL,
    lastname        VARCHAR(255),
    patronymic      VARCHAR(255),    
    email           VARCHAR(256) NOT NULL UNIQUE,
    wallet          VARCHAR(42) NOT NULL,
    image           VARCHAR(255),
    notes           TEXT,
    PRIMARY KEY(id, company_id)
);

/*type либо properties, либо stats*/
CREATE TABLE user_attributes(
    user_id         UUID NOT NULL REFERENCES users(id),
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    value           VARCHAR(255) NOT NULL,
    type            VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id, company_id)
);

CREATE TABLE erc20_tokens_supply_types(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO erc20_tokens_supply_types(name) VALUES('Capped');
INSERT INTO erc20_tokens_supply_types(name) VALUES('Fixed');
INSERT INTO erc20_tokens_supply_types(name) VALUES('Unlimited');

CREATE TABLE chains(
    id              INT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    explorer        VARCHAR(255) NOT NULL
);

INSERT INTO chains (id, name, explorer) VALUES(137, 'Polygon', 'https://explorer.matic.network');
INSERT INTO chains (id, name, explorer) VALUES(80001, 'Mumbai', 'https://mumbai.polygonscan.com');
INSERT INTO chains (id, name, explorer) VALUES(56, 'BinanceMainnet', 'https://bscscan.com');
INSERT INTO chains (id, name, explorer) VALUES(1, 'EthereumMainnet', 'https://etherscan.io');
INSERT INTO chains (id, name, explorer) VALUES(43114, 'AvalancheMainnet', 'https://snowtrace.io');
INSERT INTO chains (id, name, explorer) VALUES(42161, 'ArbitrumMainnet', 'https://arbiscan.io');
INSERT INTO chains (id, name, explorer) VALUES(10, 'OptimismMainnet', 'https://optimistic.etherscan.io');

CREATE TABLE erc20_tokens(
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    supply_type     INT NOT NULL REFERENCES erc20_tokens_supply_types(id),
    max_supply      VARCHAR(256),
    chain_id        INT NOT NULL REFERENCES chains(id),
    decimals        INT NOT NULL DEFAULT 18,
    address         VARCHAR(42) NOT NULL UNIQUE,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    mintable        BOOLEAN DEFAULT FALSE,
    ownable         BOOLEAN DEFAULT FALSE,
    roles           BOOLEAN DEFAULT FALSE,
    image           VARCHAR(255),
    PRIMARY KEY(company_id, address)
);

CREATE TABLE erc721_tokens(
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    description     TEXT,
    logo_image      VARCHAR(255),
    featured_image  VARCHAR(255),
    banner_image    VARCHAR(255),
    chain_id        INT NOT NULL REFERENCES chains(id),
    address         VARCHAR(42) NOT NULL UNIQUE,
    beneficiary     VARCHAR(42) NOT NULL UNIQUE,
    royalty_percent REAL DEFAULT 0,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    mintable        BOOLEAN DEFAULT FALSE,
    ownable         BOOLEAN DEFAULT FALSE,
    roles           BOOLEAN DEFAULT FALSE,
    uri_storage     BOOLEAN DEFAULT FALSE,
    image           VARCHAR(255),
    PRIMARY KEY(company_id, address)
);

CREATE TABLE social_links(
    company_id      UUID NOT NULL REFERENCES companies(id),
    token_address   VARCHAR(40) NOT NULL REFERENCES erc721_tokens(address),
    chain_id        INT NOT NULL REFERENCES chains(id),
    link            VARCHAR(500) NOT NULL
);

CREATE TABLE tokens_admin(
    company_id      UUID NOT NULL REFERENCES companies(id),
    token_address   VARCHAR(40) NOT NULL REFERENCES erc721_tokens(address),
    chain_id        INT NOT NULL REFERENCES chains(id),
    admin_id        UUID DEFAULT NULL,
    token_type      VARCHAR(10) NOT NULL DEFAULT 'erc20'
);

CREATE TABLE tokens_log(
    company_id      UUID NOT NULL REFERENCES companies(id),
    token_address   VARCHAR(40) NOT NULL REFERENCES erc721_tokens(address),
    chain_id        INT NOT NULL REFERENCES chains(id),
    admin_id        UUID DEFAULT NULL,
    user_id         UUID,
    description     TEXT NOT NULL,
    token_type      VARCHAR(10) NOT NULL DEFAULT 'erc20'
);

CREATE TABLE roles_log(
    company_id      UUID NOT NULL REFERENCES companies(id),
    admin_id        UUID DEFAULT NULL,
    role_id         UUID NOT NULL,
    description     TEXT NOT NULL
);

CREATE TABLE currency_types(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(20) NOT NULL
);

INSERT INTO currency_types (name) VALUES('FIAT');
INSERT INTO currency_types (name) VALUES('CRYPTO');

CREATE TABLE currencies(
    id              SERIAL PRIMARY KEY,
    type            INT NOT NULL REFERENCES currency_types(id),
    symbol          VARCHAR(20) NOT NULL,
    address         VARCHAR(42) DEFAULT NULL
);

INSERT INTO currencies (type, symbol) VALUES(1, 'USD');

CREATE TABLE balances(
    company_id      UUID NOT NULL REFERENCES companies(id),
    currency        INT NOT NULL REFERENCES currencies(id),
    amount          REAL NOT NULL DEFAULT 0
);

CREATE TABLE payment_platforms(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO payment_platforms (name) VALUES('web3');

CREATE TABLE payments(
    company_id      UUID NOT NULL REFERENCES companies(id),
    currency        INT NOT NULL REFERENCES currencies(id),
    amount          REAL NOT NULL DEFAULT 0,
    platform        INT NOT NULL REFERENCES payment_platforms(id),
    token           VARCHAR(500),
    expired         TIMESTAMP,
    paid            TIMESTAMP
);

CREATE TABLE api_keys(
    company_id      UUID NOT NULL REFERENCES companies(id),
    key             VARCHAR(255) NOT NULL,
    expired         TIMESTAMP NOT NULL
);

CREATE TABLE rewards_token(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    address         VARCHAR(42) NOT NULL REFERENCES erc20_tokens(address),
    amount          NUMERIC(78,0) NOT NULL
);

CREATE TABLE rewards_nft(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    address         VARCHAR(42) NOT NULL REFERENCES erc721_tokens(address),
    is_random       BOOLEAN NOT NULL,
    token_id        NUMERIC(78,0)
);

CREATE TABLE reward_event_statuses_token (
    id              SERIAL PRIMARY KEY,
    status          VARCHAR(255) NOT NULL
);

INSERT INTO reward_event_statuses_token (status) VALUES('Accrued');
INSERT INTO reward_event_statuses_token (status) VALUES('Retrieved by user');

CREATE TABLE reward_event_token (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status          INT NOT NULL REFERENCES reward_event_statuses_token(id),
    reward_id       UUID NOT NULL REFERENCES rewards_token(id),
    comment         TEXT
);

CREATE TABLE reward_event_nft (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status          INT NOT NULL REFERENCES reward_event_statuses_token(id),
    reward_id       UUID NOT NULL REFERENCES rewards_token(id),
    comment         TEXT
);