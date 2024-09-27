import moment from "moment";
import { checkRtspStatus } from "../../../utils/cameraUtils.js";
import { cameraDownResponse, cameraUpResponse, internalServerErrorResponse, internalServerErrorResponseForCamera, notFoundResponse, successResponse } from "../../../utils/response.js";
import { fetchUnidentifiedPeopleListQuery, fetchUserPresentAttendanceQuery, getUserAttendanceSummaryQuery, getUserByClassNameQuery, getWeeklyPresentCountQuery, insertUnknownUserAttendanceQuery, insertUserAttendanceLogsQuery } from "../models/query.js";

export const saveAttendanceLogs = async (uniqueMockData) => {
  try {
    let promises = uniqueMockData.map(async (detection) => {

      let [getUsers] = await getUserByClassNameQuery(detection.class_name);

      if (getUsers.length !== 0) {
        await insertUserAttendanceLogsQuery([ new Date(), detection.image, getUsers[0]._id]);
        console.log("Attendance marked successfully for user: ", getUsers[0].username);
      }
      else {

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
    const [data]  = await fetchUserPresentAttendanceQuery(skip);

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
    const [data]  = await fetchUnidentifiedPeopleListQuery(skip);

    if (data.length === 0) {
      return notFoundResponse(res, "", "Data not found");
    }

    return successResponse(res, data, 'Unknown detections fetched successfully');
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}