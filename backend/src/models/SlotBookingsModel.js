import { pool } from "../db/db.js";

const SlotBookingsModel = {
    async createSlotBookingsTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS slot_bookings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            vehicle_number VARCHAR(30) NOT NULL,
            user_id UUID,
            slot_id VARCHAR(30),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
        );
        `;

        try {
            await pool.query(query);
            console.log("Slot Bookings Table created successfully or already exists");
        } catch (error) {
            throw error;
        }
    },

    async createSlotBooking(vehicle_number, user_id, slot_id) {
        try {
            const query = `INSERT INTO slot_bookings(vehicle_number, user_id, slot_id) VALUES($1, $2, $3) RETURNING *;`;
            const values = [vehicle_number, user_id, slot_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.log('Error Creating Slot Booking: ', error);
            throw error;
        }
    },
}

export default SlotBookingsModel