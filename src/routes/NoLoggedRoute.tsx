import { type PropsWithChildren, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/FullScreenSpinner";
import { useNavigate } from "react-router-dom";

export const NoLoggedRoute = ({ children }: PropsWithChildren) => {
  const { loading, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate("/");
    }
  }, [loading, navigate, user]);

  if (loading) {
    return <FullScreenSpinner />;
  }

  return <>{children}</>;
};
