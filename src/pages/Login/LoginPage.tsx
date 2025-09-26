import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";

interface GooglePayload {
  email: string;
  name: string;
  picture: string;
  hd: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, token } = useAuth();
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/user", { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GooglePayload>(credentialResponse.credential);

      if (decoded.hd !== "wcpsb.com") {
        alert("Please login with your college email.");
        return;
      }

      try {
        const response = await loginWithGoogle(credentialResponse.credential);
        console.log("Login Success", response);

        login(response.token, response.user);

        if (response.user.role === "admin") {
          navigate("/dashboard/admin");
          notifications.show({
            position: "top-right",
            title: "Log-in Successful",
            message: "Welcome Admin",
            color: "green",
            autoClose: 5000,
          });
        } else {
          notifications.show({
            position: "top-right",
            title: "Log-in Successful",
            message: "Welcome User",
            color: "green",
            autoClose: 5000,
          });
          navigate("/dashboard/user");
        }
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div>
      <h1>Login to College Helpdesk</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.error("Login Failed")} />
    </div>
  );
};

export default LoginPage;
