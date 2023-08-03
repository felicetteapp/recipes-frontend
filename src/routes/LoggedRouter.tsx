import { LoggedPage } from "../components/LoggedPage";
import { AppStateContextProvider } from "../context/AppStateContext";
import { DataContextProvider } from "../context/DataContext";
import { GroupContextProvider } from "../context/GroupContext";

export const LoggedRouter = () => {
  return (
    <AppStateContextProvider>
      <GroupContextProvider>
        <DataContextProvider>
          <LoggedPage />
        </DataContextProvider>
      </GroupContextProvider>
    </AppStateContextProvider>
  );
};
