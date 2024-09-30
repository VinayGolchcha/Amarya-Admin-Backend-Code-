import moment from "moment";
import { checkRtspStatus } from "../../../utils/cameraUtils.js";
import { cameraDownResponse, cameraUpResponse, internalServerErrorResponse, internalServerErrorResponseForCamera, successResponse } from "../../../utils/response.js";
import { fetchUnidentifiedPeopleListQuery, fetchUserPresentAttendanceQuery, getUnknownUserAttendanceQuery, getUserAttendanceByUserIdAndDateQuery, getUserAttendanceLogByUserIdAndDateForInTimeQuery, getUserAttendanceSummaryQuery, getUserByEmpIdQuery, getUserByUserNameQuery, insertUnknownUserAttendanceQuery, insertUserAttendanceLogsQuery, updateInTimeUserAttenQuery, updateUnknownAttendance, updateUserAttendanceQuery, getWeeklyPresentCountQuery, getUserAttendanceLogByUserIdAndDateForOutTimeQuery, updateOutTimeUserAttenQuery, fetchAttedancePercentageOfUsersByDateQuery } from "../models/query.js";
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