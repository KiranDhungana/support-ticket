import { notifications } from "@mantine/notifications";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;

export const loginWithGoogle = async (token: string) => {
  const response = await axios.post("http://localhost:5000/api/auth/google", {
    token,
  });
  return response.data;
};

export const getTickets = () => {
  return API.get("/tickets");
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
  notifications.show({
    position: "top-right",
    title: "Logout Successful",
    message: "Welcome Admin",
    color: "green",
    autoClose: 5000,
  });
};

export const createTicket = async (ticketData: any) => {
  const response = await API.post("/tickets", ticketData);
  return response;
};

export const deleteTicketApi = async (ticketId: string) => {
  try {
    const response = await API.delete(`/tickets/${ticketId}`);
    return response;
  } catch (error) {
    console.error("Delete Ticket Error:", error);
    return false;
  }
};
export const updateTicketStatus = async (ticketId: string) => {
  try {
    const response = await API.post(`/tickets/status/${ticketId}`);
    return response;
  } catch (error) {
    console.error("Delete Ticket Error:", error);
    return false;
  }
};

export const getUsers = async () => {
  try {
    const response = await API.get(`/users`);
    return response;
  } catch (error) {
    console.error("Delete Ticket Error:", error);
    return false;
  }
};

export const promoteUser = async (userId: string) => {
  try {
    const response = await API.post(`/users/promote`, { userId });
    return response;
  } catch (error) {
    console.error("Error In promoting user:", error);
    return false;
  }
};
