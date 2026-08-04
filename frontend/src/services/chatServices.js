import axiosInstance from "./apiInstance";

export const askQuestion = (data,chatId) => {
  return axiosInstance.post(`/chat/ask/${chatId}`, data);
};
export const toggelPin = (chatId) => {
  return axiosInstance.put(`/chat/pinUnpin/${chatId}`);
};
export const archiveChat = (chatId) => {
  return axiosInstance.put(`/chat/archive/${chatId}`);
};
export const generateLink = (chatId) => {
  return axiosInstance.put(`/chat/generateLink/${chatId}`);
};
export const joinChat = (chatId, seq) => {
  return axiosInstance.put(`/chat/joinchat/${chatId}/${seq}`);
};
export const addAccess = (chatId, data) => {
  console.log(data)
return axiosInstance.put(`/chat/addAccess/${chatId}`, {
  emails: data,
});
};
export const getAllChat = () => {
  return axiosInstance.get('/chat/getAllChat')
}
export const getAllMessage = (chatId) => {
  return axiosInstance.get(`/chat/getchatmessage/${chatId}`)
}