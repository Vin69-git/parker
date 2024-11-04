import  pool  from "../db/db.js";

const ParkingSlotsModel = {
    async createParkingSlotsTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS parking_slots (
            id VARCHAR(30) PRIMARY KEY,
            status VARCHAR(30) DEFAULT 'available',
            level VARCHAR(30) NOT NULL,
            mall_id UUID,
            FOREIGN KEY (mall_id) REFERENCES malls(id)
        );
        `;

        try {
            await pool.query(query);
            console.log("Parking Slots Table created successfully or already exists");
        } catch (error) {
            throw error;
        }
    },

    async getAllParkingSlots(id) {
        const query = `
        SELECT id, level FROM parking_slots WHERE status = 'available' AND mall_id = $1;
        `;

        try {
            const result = await pool.query(query, [id]);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
    }
}

export default ParkingSlotsModel