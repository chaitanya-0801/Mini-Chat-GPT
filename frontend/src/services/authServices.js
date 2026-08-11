import axiosInstance from "./apiInstance";

export const login = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const signup = (data) => {
  return axiosInstance.post("/auth/signup", data);
};

export const sendEmailVerifyLink = () => {
    return axiosInstance.post('/auth/email-verify-link')
}
export const verifyEmail = (token,userId) => {
    return axiosInstance.put(`/auth/verify-email/${token}/${userId}`)
}

export const passwordResetLink = (data) => {
    return axiosInstance.post('/auth/password-reset-token',data)
}
export const changePassword = (token, userId, data) => {
  return axiosInstance.put(`/auth/change-password/${token}/${userId}`, data);
};