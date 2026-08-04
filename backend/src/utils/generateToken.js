import jwt from "jsonwebtoken";
export const jwtToken = async (id,name, email) => {
    const payload = {
      id:id,
    name: name,
    email: email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
