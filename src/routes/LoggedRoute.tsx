import { PropsWithChildren, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/FullScreenSpinner";
import { useNavigate } from "react-router-dom";

export const LoggedRoute = ({ children }: PropsWithChildren) => {
  const { loading, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return <FullScreenSpinner />;
  }

  return <>{children}</>;
};
