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

CREATE TABLE countries (
  code VARCHAR(2) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO countries (code, name) VALUES('RU', 'Russian Federation');
INSERT INTO countries (code, name) VALUES('US', 'United States of America');

CREATE TABLE companies(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(256) NOT NULL,
    email       VARCHAR(256) NOT NULL UNIQUE,
    password    VARCHAR(256) NOT NULL,
    wallet      VARCHAR(42) UNIQUE,
    phone       VARCHAR(18) UNIQUE NOT NULL,
    role_id     INT NOT NULL DEFAULT 0,
    country     VARCHAR(2) NOT NULL REFERENCES countries(code),
    repname     VARCHAR(255) NOT NULL
);

CREATE TABLE employees(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
    email       VARCHAR(256) NOT NULL,
    password    VARCHAR(256) NOT NULL,
    firstname   VARCHAR(255) NOT NULL,
    lastname    VARCHAR(255),
    patronymic  VARCHAR(255),
    wallet      VARCHAR(42) NOT NULL,
    phone       VARCHAR(18),
    role_id     INT NOT NULL DEFAULT 0
);

CREATE TABLE roles (
    id          INT NOT NULL,
    company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    permission_id   INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(id, company_id, permission_id)
);

/*добавить unique на company_id, email, wallet*/
CREATE TABLE users(
    id              UUID UNIQUE DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    external_id     VARCHAR(255) NOT NULL,
    email           VARCHAR(256),
    wallet          VARCHAR(42) NOT NULL,
    image           VARCHAR(255),
    notes           TEXT,
    PRIMARY KEY(id, company_id)
);

CREATE TABLE user_properties(
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    value           VARCHAR(255) NOT NULL,
    UNIQUE (user_id, company_id, name)
);

CREATE TABLE user_stats(
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    value           REAL NOT NULL,
    UNIQUE (user_id, company_id, name)
);

CREATE TABLE erc20_tokens_supply_types(
    id              INT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO erc20_tokens_supply_types(id, name) VALUES(0, 'Capped');
INSERT INTO erc20_tokens_supply_types(id, name) VALUES(1, 'Fixed');
INSERT INTO erc20_tokens_supply_types(id, name) VALUES(2, 'Unlimited');

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
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    supply_type     INT NOT NULL REFERENCES erc20_tokens_supply_types(id),
    max_supply      NUMERIC(78,0),
    initial_supply  NUMERIC(78,0),
    chainid        INT NOT NULL REFERENCES chains(id),
    decimals        INT NOT NULL DEFAULT 18,
    address         VARCHAR(42) NOT NULL UNIQUE,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    blacklist       BOOLEAN DEFAULT FALSE,
    recoverable     BOOLEAN DEFAULT FALSE,
    verified        BOOLEAN DEFAULT FALSE,
    fpmanager       VARCHAR(42) NOT NULL,
    image           VARCHAR(255),
    PRIMARY KEY(company_id, address)
);

CREATE TABLE erc721_tokens(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    description     TEXT,
    logo_image      VARCHAR(255),
    featured_image  VARCHAR(255),
    banner_image    VARCHAR(255),
    chainid         INT NOT NULL REFERENCES chains(id),
    address         VARCHAR(42) NOT NULL UNIQUE,
    beneficiary     VARCHAR(42),
    royalty_percent INT DEFAULT 0,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    mintable        BOOLEAN DEFAULT FALSE,
    ownable         BOOLEAN DEFAULT FALSE,
    roles           BOOLEAN DEFAULT FALSE,
    uri_storage     BOOLEAN DEFAULT FALSE,
    image           VARCHAR(255),
    PRIMARY KEY(company_id, address)
);

/*для v,r,s поставить правильную длину*/
CREATE TABLE nfts(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address         VARCHAR(42) NOT NULL REFERENCES erc721_tokens(address),
    image           TEXT NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    amount          INT
);

CREATE TABLE social_links(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    token_address   VARCHAR(42) NOT NULL REFERENCES erc721_tokens(address) ON DELETE CASCADE,
    chainid        INT NOT NULL REFERENCES chains(id),
    link            VARCHAR(500) NOT NULL
);

CREATE TABLE token_types(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(10) NOT NULL
);

INSERT INTO token_types (name) VALUES('erc20');
INSERT INTO token_types (name) VALUES('erc721');

CREATE TABLE tokens_admin(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    token_address   VARCHAR(42) NOT NULL,
    chainid        INT NOT NULL REFERENCES chains(id),
    admin_id        UUID DEFAULT NULL,
    token_type      INT NOT NULL REFERENCES token_types(id)
);

CREATE TABLE tokens_log(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    token_address   VARCHAR(42) NOT NULL,
    chainid        INT NOT NULL REFERENCES chains(id),
    admin_id        UUID DEFAULT NULL,
    user_id         UUID,
    description     TEXT NOT NULL,
    token_type      INT NOT NULL REFERENCES token_types(id)
);

CREATE TABLE roles_log(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    currency        INT NOT NULL REFERENCES currencies(id),
    amount          REAL NOT NULL DEFAULT 0
);

CREATE TABLE payment_platforms(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO payment_platforms (name) VALUES('web3');

CREATE TABLE payments(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    currency        INT NOT NULL REFERENCES currencies(id),
    amount          REAL NOT NULL DEFAULT 0,
    platform        INT NOT NULL REFERENCES payment_platforms(id),
    token           VARCHAR(500),
    expired         TIMESTAMP,
    paid            TIMESTAMP
);

CREATE TABLE api_keys(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    key             VARCHAR(255) NOT NULL
);

CREATE TABLE reward_statuses(
    id              INT PRIMARY KEY UNIQUE,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO reward_statuses (id, name) VALUES(0, 'Works');
INSERT INTO reward_statuses (id, name) VALUES(1, 'Not works');

CREATE TABLE rewards_erc20(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    address         VARCHAR(42) NOT NULL REFERENCES erc20_tokens(address),
    amount          NUMERIC(78,0) NOT NULL,
    status          INT NOT NULL REFERENCES reward_statuses(id) DEFAULT 0
);

CREATE TABLE rewards_erc721(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    nft_id          UUID NOT NULL REFERENCES nfts(id),
    status          INT NOT NULL REFERENCES reward_statuses(id) DEFAULT 0
);

CREATE TABLE reward_event_statuses (
    id              SERIAL PRIMARY KEY,
    status          VARCHAR(255) NOT NULL
);

INSERT INTO reward_event_statuses (status) VALUES('Accrued');
INSERT INTO reward_event_statuses (status) VALUES('Retrieved by user');

CREATE TABLE reward_event_erc20 (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status          INT NOT NULL REFERENCES reward_event_statuses(id),
    reward_id       UUID NOT NULL REFERENCES rewards_erc20(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    v               VARCHAR(2) NOT NULL,
    r               VARCHAR(66) NOT NULL,
    s               VARCHAR(66) NOT NULL,
    comment         TEXT
);

/*TODO: v,r,s правильной длинны*/
CREATE TABLE reward_event_erc721(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status          INT NOT NULL REFERENCES reward_event_statuses(id),
    reward_id       UUID NOT NULL REFERENCES rewards_erc721(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    v               VARCHAR(2) NOT NULL,
    r               VARCHAR(66) NOT NULL,
    s               VARCHAR(66) NOT NULL,
    comment         TEXT
);      