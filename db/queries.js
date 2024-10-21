const pool = require('./pool');

const queryGetUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
}

const queryGetUserById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
}

const queryCreateUser = async (firstname, lastname, email, password, isAdmin) => {
    const query = `
    INSERT INTO users (firstname, lastname, email, password, admin)
    VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [firstname, lastname, email, password, isAdmin]);
}

const queryChangeMembership = async (id) => {
    const query = `
    UPDATE users
    SET member = true
    WHERE id = $1
    `
    await pool.query(query, [id]);
}

const queryGetAllMessages = async () => {
    const query = `
    SELECT messages.id, messages.title, messages.text, messages.created_on, users.firstname, users.lastname
    FROM messages
    INNER JOIN users
    ON messages.user_id = users.id
    ORDER BY messages.id DESC
    `
    const { rows } = await pool.query(query);
    return rows;
}

const queryCreateNewMessage = async (title, text, createdOn, userId) => {
    const query = `
    INSERT INTO messages (title, text, created_on, user_id)
    VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [title, text, createdOn, userId]);
}

const queryDeleteMessage = async (id) => {
    const query = `
    DELETE FROM messages
    WHERE id = $1
    `
    await pool.query(query, [id]);
}

module.exports = {
    queryGetUserByEmail,
    queryGetUserById,
    queryCreateUser,
    queryChangeMembership,
    queryGetAllMessages,
    queryCreateNewMessage,
    queryDeleteMessage
}