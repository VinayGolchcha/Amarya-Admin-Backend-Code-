import { inAllowedTime, outAllowedTime } from "../../../utils/commonUtils.js";
import { checkUserAttendanceQuery, getUserByClassNameQuery, insertUserAttendanceQuery, updateOutTime } from "../models/query.js";

export const saveAttendance = async (uniqueMockData) => {
  try {
    let promises = uniqueMockData.map(async (detection) => {

      if (await outAllowedTime() || await inAllowedTime()) {
        let [getUsers] = await getUserByClassNameQuery(detection.class_name);

        if (getUsers.length === 0) {
          console.log(`No user found for class_name: ${detection.class_name}`);
          return;
        }

        let [getUserAttendance] = await checkUserAttendanceQuery([new Date().toISOString().slice(0, 10), getUsers[0]._id]);

        if (getUserAttendance.length === 0) {

          if (await inAllowedTime()) {
            await insertUserAttendanceQuery(['PRESENT', new Date().toISOString().slice(0, 10), new Date(), null, detection.image, getUsers[0]._id, null]);
            console.log("Attendance marked successfully for user: ", getUsers[0].username);
          }
        }

        if (getUserAttendance.length !== 0) {

          if (await outAllowedTime()) {
            await updateOutTime([detection.image, getUserAttendance[0].id])
            console.log("Outtime marked successfully for user: ", getUsers[0].username);
          }
        }

        

        return "saving attedance";

      } else {

        return "no data saved";
      
      }


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