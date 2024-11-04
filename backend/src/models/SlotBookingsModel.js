import { query } from "express";
import pool  from "../db/db.js";

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
        const query = "select status from parking_slots where id = $1";
        const values = [slot_id];
        const result = await pool.query(query, values);
        if (result.rows[0].status !== "available") {
            return "Slot not available";
        }
        try {
            const query = `INSERT INTO slot_bookings(vehicle_number, user_id, slot_id) VALUES($1, $2, $3) RETURNING *;`;
            const values = [vehicle_number, user_id, slot_id];
            const result = await pool.query(query, values);
            await pool.query("update parking_slots set status = 'occupied' where id = $1", [slot_id]);
            return result.rows[0];
        } catch (error) {
            console.log('Error Creating Slot Booking: ', error);
            throw error;
        }
    },

    async getSlotBookings(id) {
        const query = "SELECT * FROM slot_bookings WHERE id = $1";
        const value = [id];
        try {
            const result = await pool.query(query, value);
            return result.rows;
        } catch (error) {
            console.log("Error while get slot booking ", error);
            throw error
        }
    },

    async deleteSlotBooking(id){
        const slot_query = "SELECT slot_id FROM slot_bookings WHERE id = $1";
        const value = [id]
        const slot = await pool.query(slot_query,value);
        try {
            const query = `DELETE FROM slot_bookings WHERE id = $1`;
            const value = [id]
            await pool.query(query,value);
            await pool.query("update parking_slots set status = 'available' where id = $1", [slot])
        } catch (error) {
            console.log("Error while delete slot ", error);
            throw error
        }
    }
}

export default SlotBookingsModel