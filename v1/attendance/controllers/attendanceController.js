import moment from "moment";
import { checkRtspStatus } from "../../../utils/cameraUtils.js";
import { cameraDownResponse, cameraUpResponse, internalServerErrorResponse, internalServerErrorResponseForCamera, successResponse } from "../../../utils/response.js";
import { getUnknownUserAttendanceQuery, getUserAttendanceByUserIdAndDateQuery, getUserAttendanceLogByUserIdAndDateForInTimeQuery, getUserAttendanceSummaryQuery, getUserByEmpIdQuery, getUserByUserNameQuery, insertUnknownUserAttendanceQuery, insertUserAttendanceLogsQuery, updateInTimeUserAttenQuery, updateUnknownAttendance, updateUserAttendanceQuery } from "../models/query.js";
export const saveAttendanceLogs = async (uniqueMockData) => {
  try {
    let promises = uniqueMockData.map(async (detection) => {

      let [getUsers] = await getUserByUserNameQuery(detection.class_name);

      if (getUsers.length !== 0) {
        await insertUserAttendanceLogsQuery(['PRESENT', new Date(), detection.image, getUsers[0]._id]);
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
    let [summary] = await getUserAttendanceSummaryQuery([startDate, endDate, empId]);

    if (summary.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, summary[0], 'User attendance summary fetched successfully');

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};


export const getUserAttendancePercentage = async (req, res, next) => {
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
    let [summary] = await getUserAttendanceSummaryQuery([startDate, endDate, empId]);

    if (summary.length == 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    summary = summary[0][0];

    let no_present_days = summary.no_present_days;
    let total_working_days = summary.total_working_days;
    let no_absent_days = summary.no_absent_days;
    let no_holidays = summary.no_holidays;

    let presentPercentage = (no_present_days / (total_working_days - no_holidays)) * 100;

    let absentPercentage = (no_absent_days / (total_working_days - no_holidays)) * 100;

    let attendanceSummary = {
      presentPercentage: presentPercentage.toFixed(2),
      absentPercentage: absentPercentage.toFixed(2)
    };

    return successResponse(res, attendanceSummary, 'User attendance percentage fetched successfully');

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
      return res.status(400).json({ error: 'date, unknownAttendanceId and empId is required.' });
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
    return successResponse(res);

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};


export const updateMismatchedUserAttendance = async (req, res, next) => {
  try {
    const markedEmpId = req.query.markedEmpId;
    const missedEmpId = req.query.missedEmpId;
    const date = req.query.date;

    if (!markedEmpId || !date || !missedEmpId) {
      return res.status(400).json({ error: 'date, unknownAttendanceId and empId is required.' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const dateOnly = moment(date).format('YYYY-MM-DD');

    let [getMarkedUser] = await getUserByEmpIdQuery(empId);

    let [getMissedUser] = await getUserByEmpIdQuery(empId);

    if (getMarkedUser.length === 0 || getMissedUser.length === 0) {
      return res.status(400).json({ error: 'user not found for the empId.' });
    }

    let [getMarkedUserAttendance] = await getUserAttendanceByUserIdAndDateQuery([dateOnly, getMarkedUser[0]._id]);

    let [getMissedUserAttendance] = await getUserAttendanceByUserIdAndDateQuery([dateOnly, getMissedUser[0]._id]);

    if (getMarkedUserAttendance.length === 0) {
      return res.status(400).json({ error: 'user attendance not found.' });
    }

    let [data] = [null];

    let [getUserAttendanceLogForMarked] = await getUserAttendanceLogByUserIdAndDateForInTimeQuery([getMarkedUser[0]._id, dateOnly]);

    if (getMissedUserAttendance.length !== 0) {

      if (getMissedUserAttendance[0].in_time > getMarkedUserAttendance[0].created_at) {

        // updating in_time in userAttendance for missed user
        [data] = await updateInTimeUserAttenQuery([
          getMarkedUserAttendance[0].created_at,
          getMissedUser[0]._id,
          dateOnly
        ]);
        
        // updating in_time in userAttendance for marked user
        [data] = await updateInTimeUserAttenQuery([
          getUserAttendanceLogForMarked[1].created_at,
          getMissedUser[0]._id,
          dateOnly
        ]);

        console.log("updated attendance for user: ", empId);
        return successResponse(res, 'user attendance updated successfully');
      }

    } else {

      // creating userAttendance with in_time for missed user
      [data] = await updateUserAttendanceQuery(
        ["PRESENT",
          dateOnly,
          getMarkedUserAttendance[0].created_at,
          getMarkedUserAttendance[0].snapshot,
          getMissedUserAttendance[0]._id
        ]
      );

      // updating in_time in userAttendance for marked user
      [data] = await updateInTimeUserAttenQuery([
        getUserAttendanceLogForMarked[1].created_at,
        getMissedUser[0]._id,
        dateOnly
      ]);

      console.log("saved attendance for user: ", empId);
      return successResponse(res, 'user attendance saved successfully');
    }
    return successResponse(res);

  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};