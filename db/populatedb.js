#! /usr/bin/env node
const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    member BOOLEAN NOT NULL DEFAULT false,
    admin BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100) NOT NULL,
    text VARCHAR(250) NOT NULL,
    created_on DATE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);

INSERT INTO users (firstname, lastname, email, password, member, admin)
VALUES
    ('Jon', 'Snow', 'jon@test.com', '$2a$10$rqLMhFRA7QlWlwg15ZqpJe7WbRRoCn3pZRadkBb5Qjpo4QJtOMycK', true, true),
    ('Jack', 'Smith', 'jack@test.com', '$2a$10$rqLMhFRA7QlWlwg15ZqpJe7WbRRoCn3pZRadkBb5Qjpo4QJtOMycK', false, false);

INSERT INTO messages (title, text, created_on, user_id)
VALUES
    ('Hi', 'How are you?', '2024-08-28', 1),
    ('Hello', 'Hello there!', '2024-08-29', 2),
    ('Howdie', 'Hello world!', '2024-08-29', 2);
`
// password: 123456

async function main() {
    console.log('start');
    const client = new Client({
        connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();