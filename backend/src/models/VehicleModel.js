import { pool } from "../db/db.js";

const VehicleModel = {

    async createVehicleTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS vehicles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            vehicle_number VARCHAR(15) NOT NULL UNIQUE,
            vehicle_type VARCHAR(15) NOT NULL,
            user_id UUID,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `;

        try {
            await pool.query(query);
            console.log("Vehicles Table created successfully or already exists");
        } catch (error) {
            console.log("Error creating vehicles table: ", error);
            throw error;
        }
    },

    async addVehicle(vehicle_number, vehicle_type, user_id) {
        try {
            const query = `INSERT INTO vehicles(vehicle_number, vehicle_type, user_id) VALUES($1, $2, $3) RETURNING *;`;
            const values = [vehicle_number, vehicle_type, user_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.log("Error adding vehicle: ", error);
            throw error;
        }
    }
};

export default VehicleModel;