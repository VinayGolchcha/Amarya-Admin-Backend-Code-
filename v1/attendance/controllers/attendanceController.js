import moment from "moment";
import { checkRtspStatus } from "../../../utils/cameraUtils.js";
import { cameraDownResponse, cameraUpResponse, internalServerErrorResponse, internalServerErrorResponseForCamera, notFoundResponse, successResponse } from "../../../utils/response.js";
import { deleteUnidentifiedPersonQuery, fetchUnidentifiedPeopleListQuery, fetchUserPresentAttendanceQuery, getUnknownUserAttendanceQuery, getUserAttendanceByUserIdAndDateQuery, getUserAttendanceLogByUserIdAndDateForInTimeQuery, getUserAttendanceSummaryQuery, getUserByEmpIdQuery, getUserByUserNameQuery, insertUnknownUserAttendanceQuery, insertUserAttendanceLogsQuery, updateInTimeUserAttenQuery, updateUnknownAttendance, updateUserAttendanceQuery, getWeeklyPresentCountQuery, getUserAttendanceLogByUserIdAndDateForOutTimeQuery, updateOutTimeUserAttenQuery, fetchAttedancePercentageOfUsersByDateQuery, fetchMonthlyAllUserAttendanceQuery, updateUnidentifiedPersonQuery, getDailyUserAttendanceQuery, getUserAttendanceByDateQuery, checkUserByEmpIdQuery } from "../models/query.js";
import ExcelJS from 'exceljs';

export const saveAttendanceLogs = async (uniqueMockData) => {
  try {
    let promises = uniqueMockData.map(async (detection) => {

      let [getUsers] = await getUserByUserNameQuery(detection.class_name);

      if (getUsers.length !== 0) {
        await insertUserAttendanceLogsQuery([new Date(), detection.image, getUsers[0]._id]);
        console.log("Attendance marked successfully for user: ", getUsers[0].username);
      } else {
        await insertUnknownUserAttendanceQuery(
          [
            "PRESENT",
            new Date(),
            detection.image
          ]
        );
        console.log("Attendance marked successfully for unidentified user");
      }
      return "saving attedance";
    });

    await Promise.all(promises);

  } catch (error) {
    console.error('Error checking time intervals:', error);
    return false;
  }
};

export const getCameraStatus = async (req, res, next) => {
  try {

    const url = req.query.rtspUrl;

    if (!url) {
      return res.status(400).json({ error: 'RTSP URL is required.' });
    }

    const status = await checkRtspStatus(url);

    if (status !== 'Stream is accessible and running.') {

      return cameraDownResponse(res, status);
    } else {
      return cameraUpResponse(res, status);
    }

  } catch (error) {
    return internalServerErrorResponseForCamera(res, error);
  }
};

export const getUserAttendanceSummary = async (req, res, next) => {
  try {

    const empId = req.query.empId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate || !empId) {
      return res.status(400).json({ error: 'StartDate, EndDate and EmpId is required.' });
    }

    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    let [checkUser] = await checkUserByEmpIdQuery([empId]);

    if (checkUser.length === 0) {
      return notFoundResponse(res, "", "Data not found for the empployee id");
    }

    let [summary] = await getUserAttendanceSummaryQuery([startDate, endDate, empId]);

    if (summary.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    const percentages = calculatePercentages(
      summary[0][0].no_present_days,
      summary[0][0].work_from_home,
      summary[0][0].no_absent_days,
      summary[0][0].no_leaves,
      summary[0][0].total_working_days,
      summary[0][0].no_holidays
    );

    const response = {
      ...summary[0][0],
      percentages
    };

    return successResponse(res, response, 'User attendance summary fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const fetchWeeklyPresentCount = async (req, res, next) => {
  try {
    const [empWeeklyData] = await getWeeklyPresentCountQuery()
    if (empWeeklyData.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }
    return successResponse(res, empWeeklyData, 'Employee weekly present count fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}

export const fetchUserPresentAttendance = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ error: 'Invalid page number.' });
    }

    const skip = (page - 1) * 10;
    const [data] = await fetchUserPresentAttendanceQuery(skip);

    if (data.length === 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, data, 'Attendance fetched successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const fetchUnidentifiedPeopleList = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ error: 'Invalid page number.' });
    }

    const skip = (page - 1) * 10;
    const [data] = await fetchUnidentifiedPeopleListQuery(skip);

    if (data.length === 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, data, 'Unknown detections fetched successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}

export const deleteUnidentifiedPerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [data] = await deleteUnidentifiedPersonQuery([id]);
    if (data.affectedRows == 0) {
      return notFoundResponse(res, "", "Data not found");
    }
    return successResponse(res, "", 'Data Deleted Successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}

export const updateUnidentifiedPerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    let tag = req.body.tag;
    tag = tag.toUpperCase();
    const [data] = await updateUnidentifiedPersonQuery([tag, id]);
    if (data.affectedRows == 0) {
      return notFoundResponse(res, "", "Data not found");
    }
    return successResponse(res, "", 'Data Updated Successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}


export const getUserAttendancePercentage = async (req, res, next) => {
  try {

    const date = req.query.date;

    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    let [summary] = await fetchAttedancePercentageOfUsersByDateQuery([date]);

    if (summary.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, summary[0], 'User attendance percentage fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const updateUnknownAttendanceToKnown = async (req, res, next) => {
  try {
    const empId = req.query.empId;
    const unknownAttendanceId = req.query.unknownAttendanceId;
    const date = req.query.date;

    if (!unknownAttendanceId || !date || !empId) {
      return res.status(400).json({ error: 'unknownAttendanceId and empId is required.' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const dateOnly = moment(date).format('YYYY-MM-DD');

    let [getUnkwnUserAttend] = await getUnknownUserAttendanceQuery([unknownAttendanceId, dateOnly]);

    if (getUnkwnUserAttend.length === 0) {
      return res.status(400).json({ error: 'unknown user attendance not found.' });
    }

    let [getUser] = await getUserByEmpIdQuery(empId);

    if (getUser.length === 0) {
      return res.status(400).json({ error: 'user not found for the empId.' });
    }

    let [checkUserAttendance] = await getUserAttendanceByUserIdAndDateQuery([dateOnly, getUser[0]._id]);

    let [data] = [null];

    if (checkUserAttendance.length !== 0) {

      if (checkUserAttendance[0].in_time > getUnkwnUserAttend[0].created_at) {

        [data] = await updateInTimeUserAttenQuery([
          getUnkwnUserAttend[0].created_at,
          getUser[0]._id,
          dateOnly
        ]);

        await updateUnknownAttendance([empId, unknownAttendanceId]);

        console.log("updated attendance for user: ", empId);
        return successResponse(res, 'user attendance updated successfully');
      }

    } else {

      [data] = await updateUserAttendanceQuery(
        ["PRESENT",
          dateOnly,
          getUnkwnUserAttend[0].created_at,
          getUnkwnUserAttend[0].snapshot,
          getUser[0]._id
        ]
      );

      await updateUnknownAttendance([empId, unknownAttendanceId]);

      console.log("saved attendance for user: ", empId);
      return successResponse(res, 'user attendance saved successfully');
    }
    return successResponse(res, 'No changes done.');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};


export const updateMismatchedUserAttendance = async (req, res, next) => {
  try {
    const markedEmpId = req.body.markedEmpId;
    const missedEmpId = req.body.missedEmpId;
    const date = req.body.date;
    const updateType = req.body.updateType;

    if (!markedEmpId || !date || !missedEmpId || !updateType) {
      return res.status(400).json({ error: 'markedEmpId, missedEmpId, updateType and date is required.' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const dateOnly = moment(date).format('YYYY-MM-DD');

    let [getMarkedUser] = await getUserByEmpIdQuery([markedEmpId]);

    let [getMissedUser] = await getUserByEmpIdQuery([missedEmpId]);

    if (getMarkedUser.length === 0 || getMissedUser.length === 0) {
      return res.status(400).json({ error: 'user not found for the empId.' });
    }

    let [getMarkedUserAttendance] = await getUserAttendanceByUserIdAndDateQuery([dateOnly, getMarkedUser[0]._id]);

    let [getMissedUserAttendance] = await getUserAttendanceByUserIdAndDateQuery([dateOnly, getMissedUser[0]._id]);

    if (getMarkedUserAttendance.length === 0) {
      return res.status(400).json({ error: 'user attendance not found.' });
    }

    let [data] = [null];

    let [getUserAttendanceLogForMarked] = [null];

    if (updateType === "in-time") {

      [getUserAttendanceLogForMarked] = await getUserAttendanceLogByUserIdAndDateForInTimeQuery([getMarkedUser[0]._id, dateOnly]);

      if (getMissedUserAttendance.length !== 0) {

        if (getMissedUserAttendance[0].in_time > getMarkedUserAttendance[0].in_time) {

          // updating in_time in userAttendance for missed user
          [data] = await updateInTimeUserAttenQuery([
            getMarkedUserAttendance[0].in_time,
            getMarkedUserAttendance[0].in_snapshot,
            getMissedUser[0]._id,
            dateOnly
          ]);

          // updating in_time in userAttendance for marked user
          [data] = await updateInTimeUserAttenQuery([
            getUserAttendanceLogForMarked[1].created_at,
            getUserAttendanceLogForMarked[1].snapshot,
            getMarkedUser[0]._id,
            dateOnly
          ]);

          console.log("updated attendance for user: ");
          return successResponse(res, 'user attendance updated successfully');
        }

      } else {

        // creating userAttendance with in_time for missed user
        [data] = await updateUserAttendanceQuery(
          ["PRESENT",
            dateOnly,
            getMarkedUserAttendance[0].in_time,
            getMarkedUserAttendance[0].in_snapshot,
            getMissedUser[0]._id
          ]
        );

        // updating in_time in userAttendance for marked user
        [data] = await updateInTimeUserAttenQuery([
          getUserAttendanceLogForMarked[1].created_at,
          getUserAttendanceLogForMarked[1].snapshot,
          getMarkedUser[0]._id,
          dateOnly
        ]);

        console.log("saved attendance for user: ");
        return successResponse(res, 'user attendance saved successfully');
      }
      return successResponse(res);

    } else if (updateType === "out-time") {

      [getUserAttendanceLogForMarked] = await getUserAttendanceLogByUserIdAndDateForOutTimeQuery([getMarkedUser[0]._id, dateOnly]);

      if (getMissedUserAttendance.length !== 0) {

        if (getMissedUserAttendance[0].out_time < getMarkedUserAttendance[0].out_time) {

          // updating out_time in userAttendance for missed user
          [data] = await updateOutTimeUserAttenQuery([
            getMarkedUserAttendance[0].out_time,
            getMarkedUserAttendance[0].out_snapshot,
            getMissedUser[0]._id,
            dateOnly
          ]);

          // updating in_time in userAttendance for marked user
          [data] = await updateOutTimeUserAttenQuery([
            getUserAttendanceLogForMarked[1].created_at,
            getUserAttendanceLogForMarked[1].snapshot,
            getMarkedUser[0]._id,
            dateOnly
          ]);

          console.log("updated attendance for user: ");
          return successResponse(res, 'user attendance updated successfully');
        }

        // } else {

        //   // creating userAttendance with in_time for missed user
        //   [data] = await updateUserAttendanceQuery(
        //     ["PRESENT",
        //       dateOnly,
        //       getMarkedUserAttendance[0].created_at,
        //       getMarkedUserAttendance[0].snapshot,
        //       getMissedUserAttendance[0]._id
        //     ]
        //   );

        //   // updating in_time in userAttendance for marked user
        //   [data] = await updateInTimeUserAttenQuery([
        //     getUserAttendanceLogForMarked[1].created_at,
        //     getMissedUser[0]._id,
        //     dateOnly
        //   ]);

        console.log("saved attendance for user: ", empId);
        return successResponse(res, 'user attendance saved successfully');
      }
      return successResponse(res);

    } else {
      return res.status(400).json({ error: 'incorrect updateType' });
    }

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};


const calculatePercentages = (presentDays, workFromHomeDays, absentDays, leaves, totalWorkingDays, holidays) => {

  const percentages = {
    holidayPercentage: (holidays / totalWorkingDays) * 100,
    presentPercentage: (presentDays / totalWorkingDays) * 100,
    absentPercentage: (absentDays / totalWorkingDays) * 100,
    leavePercentage: (leaves / totalWorkingDays) * 100,
    workFromHomePercentage: (workFromHomeDays / totalWorkingDays) * 100,
  };

  Object.keys(percentages).forEach(key => percentages[key] = percentages[key].toFixed(2));
  return percentages;
};

export const getAllUserAttendanceSummary = async (req, res, next) => {
  try {

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'StartDate, EndDate and EmpId is required.' });
    }

    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    let [summary] = await fetchMonthlyAllUserAttendanceQuery([startDate, endDate]);

    if (summary.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }


    return successResponse(res, summary, 'User attendance summary fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const getAllUserAttendanceSummaryExcelBuffer = async (req, res, next) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'StartDate and EndDate are required.' });
    }

    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const [summary] = await fetchMonthlyAllUserAttendanceQuery([startDate, endDate]);

    if (summary.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Summary');

    const headers = [
      { header: 'S.No', key: 'sno', width: 10 },
      { header: 'Employee ID', key: 'emp_id', width: 15 },
      { header: 'Employee Name', key: 'emp_name', width: 30 },
      { header: 'Present Days', key: 'no_present_days', width: 15 },
      { header: 'Leaves', key: 'no_leaves', width: 15 },
      { header: 'Absent Days', key: 'no_absent_days', width: 15 },
      { header: 'Holidays', key: 'no_holidays', width: 15 },
      { header: 'Total Working Days', key: 'total_working_days', width: 20 },
    ];

    worksheet.columns = headers;

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    summary.forEach((item, index) => {
      worksheet.addRow({
        sno: index + 1,
        emp_id: item.emp_id,
        emp_name: item.emp_name,
        no_present_days: item.no_present_days,
        no_leaves: item.no_leaves,
        no_absent_days: item.no_absent_days,
        no_holidays: item.no_holidays,
        total_working_days: item.total_working_days,
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      row.alignment = { horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=attendance_summary.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.end(buffer);

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const getDailyUserAttendance = async (req, res, next) => {
  try {

    const start_date = req.query.startDate;
    const end_date = req.query.endDate;
    const emp_id = req.query.empId;

    if (!start_date || !end_date || !emp_id) {
      return res.status(400).json({ error: 'StartDate, EndDate and EmpId is required.' });
    }

    if (!moment(start_date, 'YYYY-MM-DD', true).isValid() || !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    let [daily_data] = await getDailyUserAttendanceQuery([start_date, end_date, emp_id]);

    if (daily_data.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }


    return successResponse(res, daily_data, 'User attendance fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

export const getUserAttendanceByDate = async (req, res, next) => {
  try {

    const date = req.query.date;


    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    let [daily_data] = await getUserAttendanceByDateQuery([date]);

    if (daily_data.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, daily_data, 'User attendance fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};