// Schedule script execution every minute
import cron from "node-cron";
import pool from "../config/db.js";
import { generateUserWorksheetExcel, updateEntries } from "./cronFunctions.js";


export const runCronJobs = () => {

    cron.schedule('* * * * *', async () => {
        try {
            await updateEntries();
        } catch (error) {
            console.error('Error executing cron updateEntries:', error);
        }
    });

    cron.schedule('30 23 1 * *', async () => {
        try {
            await generateUserWorksheetExcel()
        } catch (error) {
            console.error('Error executing cron generateUserWorksheetExcel:', error);
        }
    });

    cron.schedule('30 17 * * *', async () => {
        try {
            const current_date = new Date();
            const deletion_date = new Date(current_date.setDate(current_date.getDate() - 35));

            const query = `DELETE FROM worksheets WHERE date < ?`;
            await pool.query(query, [deletion_date]);
        } catch (error) {
            console.error('Error executing cron deletion scheduler:', error);
        }
    });
}