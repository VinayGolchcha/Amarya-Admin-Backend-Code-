import pool from "../config/db.js"
import XlsxPopulate from "xlsx-populate"
import fs from 'fs/promises';
import { getWorkingDaysCountPreviousMonth } from "../v1/helpers/functions.js"
import { getCategoryTotalPointsQuery, getUserPointsQuery, updateUserPerformanceQuery, updateUserPointsQuery, insertYearlyDataOfUsersPerformanceQuery } from "../v1/worksheets/models/performanceQuery.js"
import { checkUserAttendanceQuery, checkUserTimeFromLogs, deleteAttendanceLogsQuery, insertUnknownUserAttendanceQuery, insertUserAttendanceQuery } from "../v1/attendance/models/query.js";
import moment from 'moment';
import ffmpeg from "fluent-ffmpeg";
import { updateExperienceQuery } from "../v1/users/models/userQuery.js";
import { checkRowsLengthForNotificationQuery } from "../v1/approvals/models/approvalQuery.js";

export const updateEntries = async () => {
  try {
    // Check if there are any entries in the announcements table
    const checkSql = `SELECT COUNT(*) AS count FROM announcements`;
    const result = await pool.query(checkSql);
    const count = result[0][0].count;

    // If there are no entries, return early
    if (count === 0) {
      return `No announcement fetched`;
    }
    const sql = `
    UPDATE announcements
    SET is_new = 0
    WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 1 AND is_new = 1
  `;
    return await pool.query(sql);
  } catch (error) {
    console.error("Error updating entries:", error);
    throw error
  }
};

export const generateUserWorksheetExcel = async () => {
  try {
    const query = `
          SELECT *
          FROM worksheets
          WHERE date BETWEEN DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE() - INTERVAL 1 MONTH);
      `;

    // Query MySQL to get data
    const [results, fields] = await pool.query(query);

    // Get the current month and year
    const current_date = new Date();
    const previous_month_date = new Date(current_date);
    previous_month_date.setMonth(previous_month_date.getMonth() - 1);
    const month = previous_month_date.toLocaleString('default', { month: 'long' });
    const year = previous_month_date.getFullYear();
    const folderPath = './downloads/';
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = `${folderPath}worksheet_${year}.xlsx`;
    let workbook;

    // Check if file exists
    try {
      // Load the existing workbook
      workbook = await XlsxPopulate.fromFileAsync(filePath);
    } catch (err) {
      // If file does not exist, create a new workbook
      workbook = await XlsxPopulate.fromBlankAsync();
    }

    // Check if sheet for the current month exists
    let sheet = workbook.sheet(`${month}_${year}`);
    if (!sheet) {
      // If not, create the sheet and add column headers
      sheet = workbook.addSheet(`${month}_${year}`);
      fields.forEach((field, index) => {
        sheet.cell(1, index + 1).value(field.name);
      });
    }

    // Add rows from MySQL results
    results.forEach((row, rowIndex) => {
      fields.forEach((field, columnIndex) => {
        sheet.cell(rowIndex + 2, columnIndex + 1).value(row[field.name]);
      });
    });

    // Save the workbook
    await workbook.toFileAsync(filePath);

    return filePath;
  } catch (error) {
    console.error("Error executing fetchUserDataForExcelQuery:", error);
    throw error;
  }
}

export const calculatePerformanceForEachEmployee = async () => {
  try {
    const date = new Date();
    const previous_month = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
    const month_names = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'decm']

    // Get the name of the previous month
    const previous_month_name = month_names[previous_month];
    let number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth()

    let [category_points_can_be_earned_per_day] = await getCategoryTotalPointsQuery()
    let category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month

      let [data] = await getUserPointsQuery()
     
      //Employee Performance Logic
      for(let i=0; i< data.length; i++){
          let emp_id = data[i].emp_id
          let earned_points = parseInt(data[i].total_earned_points)
          let monthly_performance = earned_points / category_points_can_be_earned_per_month
          monthly_performance = Math.round(monthly_performance)
          // Add Performance to user table
          const [userTable, performanceTable] = await Promise.all([updateUserPerformanceQuery([monthly_performance, emp_id]), updateUserPointsQuery(previous_month_name, earned_points, emp_id)])
      }

    return `Performance Updated successfully.`;
  } catch (error) {
    console.error("Error executing calculatePerformanceForEachEmployee:", error);
    throw error;
  }
};

export const updateYearlyDataForEachEmployee = async () => {
  try {

    const date = new Date();
    const current_year = date.getFullYear();
    const previous_year = current_year - 1;

    await insertYearlyDataOfUsersPerformanceQuery(previous_year)
    return `Performance Updated for Yearly successfully.`;
  } catch (error) {
    console.error("Error executing updateYearlyDataForEachEmployee:", error);
    throw error;
  }
};

export const updateMonthlyExperienceCron = async () => {
  try {
      const [userData] = await getAllUserData();

      for(let i =0; i<userData.length; i++) {
          const experience_increment = 1 / 12;
          let experience = (userData[i].experience || 0) + experience_increment;
          await updateExperienceQuery([experience, userData[i].emp_id])
      }
      return 'All experience updated successfully';
  } catch (error) {
    console.error("Error executing updateMonthlyExperienceCron:", error);
    throw error;
  }
}

export const sendEmailNotificationForApproval = async () => {
  try {
        const current_date = new Date();
        current_date.setMinutes(current_date.getMinutes() - 5);
        let date = current_date.toISOString().slice(0, 19).replace('T', ' ');
        const [rows] = await checkRowsLengthForNotificationQuery([date]);
        const email = 'tamanna.suhane@amaryaconsultancy.com';

      if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
              if(rows[i].status === 'pending'){
                  await sendMail(email, `A new request for ${rows[i].request_type} from employeeID ${rows[i].emp_id} has come. \n\n\n\nRegards,\nAmarya Business Consultancy`, 'New Approval Request');
              }
          }
      }
      return 'All experience updated successfully';
  } catch (error) {
    console.error("Error executing updateMonthlyExperienceCron:", error);
    throw error;
  }
}

export const saveAttendance = async () => {
  try {
    // const date = new Date();
    // date.setDate(date.getDate() - 1);
    // const previousDayDt = date.toISOString().slice(0, 10);

    // const moment = require('moment');
    const previousDayDt = moment().subtract(1, 'days').format('YYYY-MM-DD');
    console.log(previousDayDt);

    let [getUserAttendanceLogs] = await checkUserTimeFromLogs([previousDayDt]);

    if (getUserAttendanceLogs.length === 0) {
      console.log("no records found for date: ", previousDayDt)
      return;
    }

    for (const log of getUserAttendanceLogs) {

      // const utcDate = new Date(log.date);
      // const year = utcDate.getFullYear();
      // const month = String(utcDate.getMonth() + 1).padStart(2, '0');
      // const day = String(utcDate.getDate()).padStart(2, '0');
      // const dateOnly = `${year}-${month}-${day}`;

      const dateOnly = moment(log.date).format('YYYY-MM-DD');
      console.log(dateOnly);

      let [getUserAttendance] = await checkUserAttendanceQuery([previousDayDt, log.user_id]);

      if (getUserAttendance.length === 0) {

        await insertUserAttendanceQuery(
          ["PRESENT",
            dateOnly,
            log.in_time,
            log.out_time,
            log.in_snapshot,
            log.user_id,
            log.out_snapshot]
        );

        console.log("Saving attendance for user: ", log.user_id);
      } else {
        console.log("Attendance already marked for the user.")
        continue;
      }

    }
    
    return;

  } catch (error) {
    console.error('Error checking time intervals:', error);
    throw error;
  }
};

export const deleteAttendanceLogs = async () => {
  try {

    // const date = new Date();
    // date.setDate(date.getDate() - 2);
    // const previousDayDt = date.toISOString().slice(0, 10);

    // const moment = require('moment');
    const previousDayDt = moment().subtract(2, 'days').format('YYYY-MM-DD');
    console.log(previousDayDt);

    console.log("Deleting attendance logs for date: ", previousDayDt);
    await deleteAttendanceLogsQuery(previousDayDt);

    return `Attendance logs delete successfully.`;
  } catch (error) {
    console.error("Error executing deleteAttendanceLogs:", error);
    throw error;
  }
};