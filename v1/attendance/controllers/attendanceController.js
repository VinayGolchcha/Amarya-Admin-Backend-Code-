import { inAllowedTime, outAllowedTime } from "../../../utils/commonUtils.js";
import { checkUserAttendanceLogsQuery, checkUserAttendanceQuery, checkUserTimeFromLogs, getUserByClassNameQuery, insertUserAttendanceLogsQuery, insertUserAttendanceQuery, updateOutTime } from "../models/query.js";

export const saveAttendanceLogs = async (uniqueMockData) => {
  try {
    let promises = uniqueMockData.map(async (detection) => {

      let [getUsers] = await getUserByClassNameQuery(detection.class_name);

      let is_indentify = null;

      if (getUsers.length !== 0) {
        is_indentify = true;
        await insertUserAttendanceLogsQuery(['PRESENT', new Date(), detection.image, getUsers[0]._id, is_indentify]);
        console.log("Attendance marked successfully for user: ", getUsers[0].username);
      }
      else {
        is_indentify = false;
        await insertUserAttendanceLogsQuery(['PRESENT', new Date(), detection.image, null, is_indentify]);
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

// export const checkAndUpdateCameraStatus = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return errorResponse(res, errors.array(), "")
//     }

//     const [data] = await fetchFeebackQuery();

//     if (data.length == 0) {
//       return notFoundResponse(res, '', 'Data not found.');
//     }

//     return successResponse(res, data, 'Feedback send successfully.');
//   } catch (error) {
//     return internalServerErrorResponse(res, error);
//   }
// };

export const fetchEmployeeAttendanceList = async (req, res, next) => {
  try {
    
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
}