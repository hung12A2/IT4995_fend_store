import { AuthProvider } from "react-admin";
import { signIn } from "@/api/auth.api";

export type Credentials = {
  email: string;
  password: string;
  role: string;
};

const login = async ({ email, password, role ='customer' }: Credentials): Promise<boolean> => {
  try {
    await signIn(email, password, role);
    return true;
  } catch (error) {
    console.log("err", error);
    throw error;
  }
};

const logout = async () => {
  localStorage.removeItem("user");
  return Promise.resolve();
};

const checkError = (error: any) => {
  const status = error.status;
  if (status === 401 || status === 403) {
    localStorage.removeItem("user");
    return Promise.reject();
  }

  return Promise.resolve();
};

const checkAuth = (params: any) => {
  let user: any = localStorage.getItem("user");
  user = JSON.parse(user).user;
  const { status } = user;
  console.log (status)

  if (status !== "active") { 
    return Promise.reject({
      message: 'User not active'
    })
  }

  return localStorage.getItem("user") 
    ? Promise.resolve()
    : Promise.reject({
      message: 'User not authenticated'
    });
};

const getPermissions = (params: any) => {
  let user: any = localStorage.getItem("user");
  user = JSON.parse(user);

  const { permissions } = user;
  return Promise.resolve({ permissions });
};

const getIdentity = () => {
  let user: any = localStorage.getItem("user");
  let token: any = localStorage.getItem("token");
  user = JSON.parse(user);
  token = JSON.parse(token);
  user.token = token.token;
  const identity = user;
  return Promise.resolve(identity);
};

export const authProvider: AuthProvider = {
  login,
  logout,
  checkAuth,
  checkError,
  getPermissions,
  getIdentity,
};
