import userTable  from "../v1/users/models/userModel.js";
import assetTable  from "../v1/assets/models/assetModel.js";
import trainingTable from "../v1/trainings/models/trainingModel.js";
import usertrainingTable from "../v1/trainings/models/userTrainingModel.js";
import assetRequestTable  from "../v1/assets/models/userAssetModel.js";
import approvalTable  from "../v1/approvals/models/approvalModel.js";
import announcementTable from "../v1/announcements/models/announcementModel.js";

export default [userTable, assetTable, trainingTable, usertrainingTable, assetRequestTable, approvalTable, announcementTable];