import { pool } from "../db/db.js";

const MallsModel = {
    async createMallsTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS malls (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            location VARCHAR(30) NOT NULL
        );
        `;

        try {
            await pool.query(query);
            console.log("Malls Table created successfully or already exists");
        } catch (error) {
            throw error;
        }
    }
}

export default MallsModel