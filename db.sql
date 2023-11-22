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

INSERT INTO countries (code, name) VALUES ('AD', 'Andorra');
INSERT INTO countries (code, name) VALUES ('AE', 'United Arab Emirates');
INSERT INTO countries (code, name) VALUES ('AF', 'Afghanistan');
INSERT INTO countries (code, name) VALUES ('AG', 'Antigua and Barbuda');
INSERT INTO countries (code, name) VALUES ('AI', 'Anguilla');
INSERT INTO countries (code, name) VALUES ('AL', 'Albania');
INSERT INTO countries (code, name) VALUES ('AM', 'Armenia');
INSERT INTO countries (code, name) VALUES ('AO', 'Angola');
INSERT INTO countries (code, name) VALUES ('AQ', 'Antarctica');
INSERT INTO countries (code, name) VALUES ('AR', 'Argentina');
INSERT INTO countries (code, name) VALUES ('AS', 'American Samoa');
INSERT INTO countries (code, name) VALUES ('AT', 'Austria');
INSERT INTO countries (code, name) VALUES ('AU', 'Australia');
INSERT INTO countries (code, name) VALUES ('AW', 'Aruba');
INSERT INTO countries (code, name) VALUES ('AX', 'Åland Islands');
INSERT INTO countries (code, name) VALUES ('AZ', 'Azerbaijan');
INSERT INTO countries (code, name) VALUES ('BA', 'Bosnia and Herzegovina');
INSERT INTO countries (code, name) VALUES ('BB', 'Barbados');
INSERT INTO countries (code, name) VALUES ('BD', 'Bangladesh');
INSERT INTO countries (code, name) VALUES ('BE', 'Belgium');
INSERT INTO countries (code, name) VALUES ('BF', 'Burkina Faso');
INSERT INTO countries (code, name) VALUES ('BG', 'Bulgaria');
INSERT INTO countries (code, name) VALUES ('BH', 'Bahrain');
INSERT INTO countries (code, name) VALUES ('BI', 'Burundi');
INSERT INTO countries (code, name) VALUES ('BJ', 'Benin');
INSERT INTO countries (code, name) VALUES ('BL', 'Saint Barthélemy');
INSERT INTO countries (code, name) VALUES ('BM', 'Bermuda');
INSERT INTO countries (code, name) VALUES ('BN', 'Brunei Darussalam');
INSERT INTO countries (code, name) VALUES ('BO', 'Bolivia, Plurinational State of');
INSERT INTO countries (code, name) VALUES ('BQ', 'Bonaire, Sint Eustatius and Saba');
INSERT INTO countries (code, name) VALUES ('BR', 'Brazil');
INSERT INTO countries (code, name) VALUES ('BS', 'Bahamas');
INSERT INTO countries (code, name) VALUES ('BT', 'Bhutan');
INSERT INTO countries (code, name) VALUES ('BV', 'Bouvet Island');
INSERT INTO countries (code, name) VALUES ('BW', 'Botswana');
INSERT INTO countries (code, name) VALUES ('BY', 'Belarus');
INSERT INTO countries (code, name) VALUES ('BZ', 'Belize');
INSERT INTO countries (code, name) VALUES ('CA', 'Canada');
INSERT INTO countries (code, name) VALUES ('CC', 'Cocos (Keeling) Islands');
INSERT INTO countries (code, name) VALUES ('CD', 'Congo, Democratic Republic of the');
INSERT INTO countries (code, name) VALUES ('CF', 'Central African Republic');
INSERT INTO countries (code, name) VALUES ('CG', 'Congo');
INSERT INTO countries (code, name) VALUES ('CH', 'Switzerland');
INSERT INTO countries (code, name) VALUES ('CI', 'Côte d''Ivoire');
INSERT INTO countries (code, name) VALUES ('CK', 'Cook Islands');
INSERT INTO countries (code, name) VALUES ('CL', 'Chile');
INSERT INTO countries (code, name) VALUES ('CM', 'Cameroon');
INSERT INTO countries (code, name) VALUES ('CN', 'China');
INSERT INTO countries (code, name) VALUES ('CO', 'Colombia');
INSERT INTO countries (code, name) VALUES ('CR', 'Costa Rica');
INSERT INTO countries (code, name) VALUES ('CU', 'Cuba');
INSERT INTO countries (code, name) VALUES ('CV', 'Cabo Verde');
INSERT INTO countries (code, name) VALUES ('CW', 'Curaçao');
INSERT INTO countries (code, name) VALUES ('CX', 'Christmas Island');
INSERT INTO countries (code, name) VALUES ('CY', 'Cyprus');
INSERT INTO countries (code, name) VALUES ('CZ', 'Czechia');
INSERT INTO countries (code, name) VALUES ('DE', 'Germany');
INSERT INTO countries (code, name) VALUES ('DJ', 'Djibouti');
INSERT INTO countries (code, name) VALUES ('DK', 'Denmark');
INSERT INTO countries (code, name) VALUES ('DM', 'Dominica');
INSERT INTO countries (code, name) VALUES ('DO', 'Dominican Republic');
INSERT INTO countries (code, name) VALUES ('DZ', 'Algeria');
INSERT INTO countries (code, name) VALUES ('EC', 'Ecuador');
INSERT INTO countries (code, name) VALUES ('EE', 'Estonia');
INSERT INTO countries (code, name) VALUES ('EG', 'Egypt');
INSERT INTO countries (code, name) VALUES ('EH', 'Western Sahara');
INSERT INTO countries (code, name) VALUES ('ER', 'Eritrea');
INSERT INTO countries (code, name) VALUES ('ES', 'Spain');
INSERT INTO countries (code, name) VALUES ('ET', 'Ethiopia');
INSERT INTO countries (code, name) VALUES ('FI', 'Finland');
INSERT INTO countries (code, name) VALUES ('FJ', 'Fiji');
INSERT INTO countries (code, name) VALUES ('FK', 'Falkland Islands (Malvinas)');
INSERT INTO countries (code, name) VALUES ('FM', 'Micronesia, Federated States of');
INSERT INTO countries (code, name) VALUES ('FO', 'Faroe Islands');
INSERT INTO countries (code, name) VALUES ('FR', 'France');
INSERT INTO countries (code, name) VALUES ('GA', 'Gabon');
INSERT INTO countries (code, name) VALUES ('GB', 'United Kingdom of Great Britain and Northern Ireland');
INSERT INTO countries (code, name) VALUES ('GD', 'Grenada');
INSERT INTO countries (code, name) VALUES ('GE', 'Georgia');
INSERT INTO countries (code, name) VALUES ('GF', 'French Guiana');
INSERT INTO countries (code, name) VALUES ('GG', 'Guernsey');
INSERT INTO countries (code, name) VALUES ('GH', 'Ghana');
INSERT INTO countries (code, name) VALUES ('GI', 'Gibraltar');
INSERT INTO countries (code, name) VALUES ('GL', 'Greenland');
INSERT INTO countries (code, name) VALUES ('GM', 'Gambia');
INSERT INTO countries (code, name) VALUES ('GN', 'Guinea');
INSERT INTO countries (code, name) VALUES ('GP', 'Guadeloupe');
INSERT INTO countries (code, name) VALUES ('GQ', 'Equatorial Guinea');
INSERT INTO countries (code, name) VALUES ('GR', 'Greece');
INSERT INTO countries (code, name) VALUES ('GS', 'South Georgia and the South Sandwich Islands');
INSERT INTO countries (code, name) VALUES ('GT', 'Guatemala');
INSERT INTO countries (code, name) VALUES ('GU', 'Guam');
INSERT INTO countries (code, name) VALUES ('GW', 'Guinea-Bissau');
INSERT INTO countries (code, name) VALUES ('GY', 'Guyana');
INSERT INTO countries (code, name) VALUES ('HK', 'Hong Kong');
INSERT INTO countries (code, name) VALUES ('HM', 'Heard Island and McDonald Islands');
INSERT INTO countries (code, name) VALUES ('HN', 'Honduras');
INSERT INTO countries (code, name) VALUES ('HR', 'Croatia');
INSERT INTO countries (code, name) VALUES ('HT', 'Haiti');
INSERT INTO countries (code, name) VALUES ('HU', 'Hungary');
INSERT INTO countries (code, name) VALUES ('ID', 'Indonesia');
INSERT INTO countries (code, name) VALUES ('IE', 'Ireland');
INSERT INTO countries (code, name) VALUES ('IL', 'Israel');
INSERT INTO countries (code, name) VALUES ('IM', 'Isle of Man');
INSERT INTO countries (code, name) VALUES ('IN', 'India');
INSERT INTO countries (code, name) VALUES ('IO', 'British Indian Ocean Territory');
INSERT INTO countries (code, name) VALUES ('IQ', 'Iraq');
INSERT INTO countries (code, name) VALUES ('IR', 'Iran, Islamic Republic of');
INSERT INTO countries (code, name) VALUES ('IS', 'Iceland');
INSERT INTO countries (code, name) VALUES ('IT', 'Italy');
INSERT INTO countries (code, name) VALUES ('JE', 'Jersey');
INSERT INTO countries (code, name) VALUES ('JM', 'Jamaica');
INSERT INTO countries (code, name) VALUES ('JO', 'Jordan');
INSERT INTO countries (code, name) VALUES ('JP', 'Japan');
INSERT INTO countries (code, name) VALUES ('KE', 'Kenya');
INSERT INTO countries (code, name) VALUES ('KG', 'Kyrgyzstan');
INSERT INTO countries (code, name) VALUES ('KH', 'Cambodia');
INSERT INTO countries (code, name) VALUES ('KI', 'Kiribati');
INSERT INTO countries (code, name) VALUES ('KM', 'Comoros');
INSERT INTO countries (code, name) VALUES ('KN', 'Saint Kitts and Nevis');
INSERT INTO countries (code, name) VALUES ('KP', 'Korea, Democratic People''s Republic of');
INSERT INTO countries (code, name) VALUES ('KR', 'Korea, Republic of');
INSERT INTO countries (code, name) VALUES ('KW', 'Kuwait');
INSERT INTO countries (code, name) VALUES ('KY', 'Cayman Islands');
INSERT INTO countries (code, name) VALUES ('KZ', 'Kazakhstan');
INSERT INTO countries (code, name) VALUES ('LA', 'Lao People''s Democratic Republic');
INSERT INTO countries (code, name) VALUES ('LB', 'Lebanon');
INSERT INTO countries (code, name) VALUES ('LC', 'Saint Lucia');
INSERT INTO countries (code, name) VALUES ('LI', 'Liechtenstein');
INSERT INTO countries (code, name) VALUES ('LK', 'Sri Lanka');
INSERT INTO countries (code, name) VALUES ('LR', 'Liberia');
INSERT INTO countries (code, name) VALUES ('LS', 'Lesotho');
INSERT INTO countries (code, name) VALUES ('LT', 'Lithuania');
INSERT INTO countries (code, name) VALUES ('LU', 'Luxembourg');
INSERT INTO countries (code, name) VALUES ('LV', 'Latvia');
INSERT INTO countries (code, name) VALUES ('LY', 'Libya');
INSERT INTO countries (code, name) VALUES ('MA', 'Morocco');
INSERT INTO countries (code, name) VALUES ('MC', 'Monaco');
INSERT INTO countries (code, name) VALUES ('MD', 'Moldova, Republic of');
INSERT INTO countries (code, name) VALUES ('ME', 'Montenegro');
INSERT INTO countries (code, name) VALUES ('MF', 'Saint Martin, (French part)');
INSERT INTO countries (code, name) VALUES ('MG', 'Madagascar');
INSERT INTO countries (code, name) VALUES ('MH', 'Marshall Islands');
INSERT INTO countries (code, name) VALUES ('MK', 'North Macedonia');
INSERT INTO countries (code, name) VALUES ('ML', 'Mali');
INSERT INTO countries (code, name) VALUES ('MM', 'Myanmar');
INSERT INTO countries (code, name) VALUES ('MN', 'Mongolia');
INSERT INTO countries (code, name) VALUES ('MO', 'Macao');
INSERT INTO countries (code, name) VALUES ('MP', 'Northern Mariana Islands');
INSERT INTO countries (code, name) VALUES ('MQ', 'Martinique');
INSERT INTO countries (code, name) VALUES ('MR', 'Mauritania');
INSERT INTO countries (code, name) VALUES ('MS', 'Montserrat');
INSERT INTO countries (code, name) VALUES ('MT', 'Malta');
INSERT INTO countries (code, name) VALUES ('MU', 'Mauritius');
INSERT INTO countries (code, name) VALUES ('MV', 'Maldives');
INSERT INTO countries (code, name) VALUES ('MW', 'Malawi');
INSERT INTO countries (code, name) VALUES ('MX', 'Mexico');
INSERT INTO countries (code, name) VALUES ('MY', 'Malaysia');
INSERT INTO countries (code, name) VALUES ('MZ', 'Mozambique');
INSERT INTO countries (code, name) VALUES ('NA', 'Namibia');
INSERT INTO countries (code, name) VALUES ('NC', 'New Caledonia');
INSERT INTO countries (code, name) VALUES ('NE', 'Niger');
INSERT INTO countries (code, name) VALUES ('NF', 'Norfolk Island');
INSERT INTO countries (code, name) VALUES ('NG', 'Nigeria');
INSERT INTO countries (code, name) VALUES ('NI', 'Nicaragua');
INSERT INTO countries (code, name) VALUES ('NL', 'Netherlands');
INSERT INTO countries (code, name) VALUES ('NO', 'Norway');
INSERT INTO countries (code, name) VALUES ('NP', 'Nepal');
INSERT INTO countries (code, name) VALUES ('NR', 'Nauru');
INSERT INTO countries (code, name) VALUES ('NU', 'Niue');
INSERT INTO countries (code, name) VALUES ('NZ', 'New Zealand');
INSERT INTO countries (code, name) VALUES ('OM', 'Oman');
INSERT INTO countries (code, name) VALUES ('PA', 'Panama');
INSERT INTO countries (code, name) VALUES ('PE', 'Peru');
INSERT INTO countries (code, name) VALUES ('PF', 'French Polynesia');
INSERT INTO countries (code, name) VALUES ('PG', 'Papua New Guinea');
INSERT INTO countries (code, name) VALUES ('PH', 'Philippines');
INSERT INTO countries (code, name) VALUES ('PK', 'Pakistan');
INSERT INTO countries (code, name) VALUES ('PL', 'Poland');
INSERT INTO countries (code, name) VALUES ('PM', 'Saint Pierre and Miquelon');
INSERT INTO countries (code, name) VALUES ('PN', 'Pitcairn');
INSERT INTO countries (code, name) VALUES ('PR', 'Puerto Rico');
INSERT INTO countries (code, name) VALUES ('PS', 'Palestine, State of');
INSERT INTO countries (code, name) VALUES ('PT', 'Portugal');
INSERT INTO countries (code, name) VALUES ('PW', 'Palau');
INSERT INTO countries (code, name) VALUES ('PY', 'Paraguay');
INSERT INTO countries (code, name) VALUES ('QA', 'Qatar');
INSERT INTO countries (code, name) VALUES ('RE', 'Réunion');
INSERT INTO countries (code, name) VALUES ('RO', 'Romania');
INSERT INTO countries (code, name) VALUES ('RS', 'Serbia');
INSERT INTO countries (code, name) VALUES ('RU', 'Russian Federation');
INSERT INTO countries (code, name) VALUES ('RW', 'Rwanda');
INSERT INTO countries (code, name) VALUES ('SA', 'Saudi Arabia');
INSERT INTO countries (code, name) VALUES ('SB', 'Solomon Islands');
INSERT INTO countries (code, name) VALUES ('SC', 'Seychelles');
INSERT INTO countries (code, name) VALUES ('SD', 'Sudan');
INSERT INTO countries (code, name) VALUES ('SE', 'Sweden');
INSERT INTO countries (code, name) VALUES ('SG', 'Singapore');
INSERT INTO countries (code, name) VALUES ('SH', 'Saint Helena, Ascension and Tristan da Cunha');
INSERT INTO countries (code, name) VALUES ('SI', 'Slovenia');
INSERT INTO countries (code, name) VALUES ('SJ', 'Svalbard and Jan Mayen');
INSERT INTO countries (code, name) VALUES ('SK', 'Slovakia');
INSERT INTO countries (code, name) VALUES ('SL', 'Sierra Leone');
INSERT INTO countries (code, name) VALUES ('SM', 'San Marino');
INSERT INTO countries (code, name) VALUES ('SN', 'Senegal');
INSERT INTO countries (code, name) VALUES ('SO', 'Somalia');
INSERT INTO countries (code, name) VALUES ('SR', 'Suriname');
INSERT INTO countries (code, name) VALUES ('SS', 'South Sudan');
INSERT INTO countries (code, name) VALUES ('ST', 'Sao Tome and Principe');
INSERT INTO countries (code, name) VALUES ('SV', 'El Salvador');
INSERT INTO countries (code, name) VALUES ('SX', 'Sint Maarten, (Dutch part)');
INSERT INTO countries (code, name) VALUES ('SY', 'Syrian Arab Republic');
INSERT INTO countries (code, name) VALUES ('SZ', 'Eswatini');
INSERT INTO countries (code, name) VALUES ('TC', 'Turks and Caicos Islands');
INSERT INTO countries (code, name) VALUES ('TD', 'Chad');
INSERT INTO countries (code, name) VALUES ('TF', 'French Southern Territories');
INSERT INTO countries (code, name) VALUES ('TG', 'Togo');
INSERT INTO countries (code, name) VALUES ('TH', 'Thailand');
INSERT INTO countries (code, name) VALUES ('TJ', 'Tajikistan');
INSERT INTO countries (code, name) VALUES ('TK', 'Tokelau');
INSERT INTO countries (code, name) VALUES ('TL', 'Timor-Leste');
INSERT INTO countries (code, name) VALUES ('TM', 'Turkmenistan');
INSERT INTO countries (code, name) VALUES ('TN', 'Tunisia');
INSERT INTO countries (code, name) VALUES ('TO', 'Tonga');
INSERT INTO countries (code, name) VALUES ('TR', 'Türkiye');
INSERT INTO countries (code, name) VALUES ('TT', 'Trinidad and Tobago');
INSERT INTO countries (code, name) VALUES ('TV', 'Tuvalu');
INSERT INTO countries (code, name) VALUES ('TW', 'Taiwan, Province of China');
INSERT INTO countries (code, name) VALUES ('TZ', 'Tanzania, United Republic of');
INSERT INTO countries (code, name) VALUES ('UA', 'Ukraine');
INSERT INTO countries (code, name) VALUES ('UG', 'Uganda');
INSERT INTO countries (code, name) VALUES ('UM', 'United States Minor Outlying Islands');
INSERT INTO countries (code, name) VALUES ('US', 'United States of America');
INSERT INTO countries (code, name) VALUES ('UY', 'Uruguay');
INSERT INTO countries (code, name) VALUES ('UZ', 'Uzbekistan');
INSERT INTO countries (code, name) VALUES ('VA', 'Holy See');
INSERT INTO countries (code, name) VALUES ('VC', 'Saint Vincent and the Grenadines');
INSERT INTO countries (code, name) VALUES ('VE', 'Venezuela, Bolivarian Republic of');
INSERT INTO countries (code, name) VALUES ('VG', 'Virgin Islands, British');
INSERT INTO countries (code, name) VALUES ('VI', 'Virgin Islands, U.S.');
INSERT INTO countries (code, name) VALUES ('VN', 'Viet Nam');
INSERT INTO countries (code, name) VALUES ('VU', 'Vanuatu');
INSERT INTO countries (code, name) VALUES ('WF', 'Wallis and Futuna');
INSERT INTO countries (code, name) VALUES ('WS', 'Samoa');
INSERT INTO countries (code, name) VALUES ('YE', 'Yemen');
INSERT INTO countries (code, name) VALUES ('YT', 'Mayotte');
INSERT INTO countries (code, name) VALUES ('ZA', 'South Africa');
INSERT INTO countries (code, name) VALUES ('ZM', 'Zambia');
INSERT INTO countries (code, name) VALUES ('ZW', 'Zimbabwe');

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
INSERT INTO chains (id, name, explorer) VALUES(5, 'Goerli', 'https://goerli.etherscan.io');
INSERT INTO chains (id, name, explorer) VALUES(97, 'BinanceTestnet', 'https://testnet.bscscan.com');

CREATE TABLE erc20_tokens(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    supply_type     INT NOT NULL REFERENCES erc20_tokens_supply_types(id),
    max_supply      NUMERIC(78,0),
    initial_supply  NUMERIC(78,0),
    chainid         INT NOT NULL REFERENCES chains(id),
    decimals        INT NOT NULL DEFAULT 18,
    address         VARCHAR(42) NOT NULL,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    blacklist       BOOLEAN DEFAULT FALSE,
    recoverable     BOOLEAN DEFAULT FALSE,
    verified        BOOLEAN DEFAULT FALSE,
    fpmanager       VARCHAR(42) NOT NULL,
    image           VARCHAR(255),
    PRIMARY KEY(chainid, address)
);

CREATE TABLE erc721_tokens(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    symbol          VARCHAR(255) NOT NULL,
    description     VARCHAR(1000),
    logo_image      VARCHAR(255),
    featured_image  VARCHAR(255),
    banner_image    VARCHAR(255),
    chainid         INT NOT NULL REFERENCES chains(id),
    address         VARCHAR(42) NOT NULL,
    beneficiary     VARCHAR(42),
    royalty_percent INT DEFAULT 0,
    pausable        BOOLEAN DEFAULT FALSE,
    burnable        BOOLEAN DEFAULT FALSE,
    mintable        BOOLEAN DEFAULT FALSE,
    ownable         BOOLEAN DEFAULT FALSE,
    roles           BOOLEAN DEFAULT FALSE,
    uri_storage     BOOLEAN DEFAULT FALSE,
    image           VARCHAR(255),
    PRIMARY KEY(chainid, address)
);

/*для v,r,s поставить правильную длину*/
CREATE TABLE nfts(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chainid         INT NOT NULL REFERENCES chains(id),
    address         VARCHAR(42) NOT NULL,
    image           TEXT NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(1000),
    amount          INT
);

CREATE TABLE social_links(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    token_address   VARCHAR(42) NOT NULL,
    chainid         INT NOT NULL REFERENCES chains(id),
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
    description     VARCHAR(1000) NOT NULL,
    token_type      INT NOT NULL REFERENCES token_types(id)
);

CREATE TABLE roles_log(
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    admin_id        UUID DEFAULT NULL,
    role_id         UUID NOT NULL,
    description     VARCHAR(1000) NOT NULL
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
    key             TEXT NOT NULL
);
CREATE INDEX idx_api_keys_key ON api_keys(key);

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
    description     VARCHAR(1000),
    chainid         INT NOT NULL REFERENCES chains(id),
    address         VARCHAR(42) NOT NULL,
    amount          NUMERIC(78,0) NOT NULL,
    status          INT NOT NULL REFERENCES reward_statuses(id) DEFAULT 0
);

CREATE TABLE rewards_erc721(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    chainid         INT NOT NULL REFERENCES chains(id),
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(1000),
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

ALTER TABLE reward_event_erc20 ADD event_datetime TIMESTAMPTZ DEFAULT NOW(); 
ALTER TABLE reward_event_erc721 ADD event_datetime TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE users ADD add_datetime TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE rewards_erc721 ADD chainid INT NOT NULL REFERENCES chains(id) DEFAULT '80001';