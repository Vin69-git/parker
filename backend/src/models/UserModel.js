import { pool } from "../db/db.js";
import bcrypt from "bcrypt";

const UserModel = {
    async createUsersTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(15) NOT NULL UNIQUE
        );
        `;

        try {
            await pool.query(query);
            console.log("Users Table created successfully or already exists");
        } catch (error) {
            console.log('Error Creating Users table: ', error);
            throw error;
        }
    },

    async createUser(name, email, password, phone_number) {
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const query = `INSERT INTO users(name, email, password, phone_number) VALUES($1, $2, $3, $4) RETURNING *;`;
            const values = [name, email, hashedPassword, phone_number];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.log('Error Creating User: ', error);
            throw error;
        }
    }
};

export default UserModel;
