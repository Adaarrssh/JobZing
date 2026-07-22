import Notification from "../models/notification.model.js";
const createNotification = async ({
  userId,
  title,
  message,
  type,
  referenceId = null,
  referenceType = null,
}) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
    referenceId,
    referenceType,
  });
};
export default createNotification;
