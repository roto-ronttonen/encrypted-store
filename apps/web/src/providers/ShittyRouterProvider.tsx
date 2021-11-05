import React, { useState } from "react";
import { useContext } from "react";
import { useMemo } from "react";
import ListFilesView from "../views/ListFilesView";
import LoginView from "../views/LoginView";
import SingeFileView from "../views/SingleFileView";

type ShittyRouterContextValue = {
  component: JSX.Element;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewString>>;
};

const ShittyRouterContext = React.createContext<ShittyRouterContextValue>(
  null as any
);
export type ViewString = "login" | "list-files" | "single-file";
export type ShittyRouterProviderProps = {
  children: React.ReactNode;
};

export function ShittyRouterProvider({ children }: ShittyRouterProviderProps) {
  const [currentView, setCurrentView] = useState<ViewString>("login");

  const currentComponent = () => {
    switch (currentView) {
      case "login":
        return <LoginView />;
      case "list-files":
        return <ListFilesView />;
      case "single-file":
        return <SingeFileView />;
    }
  };

  const value = {
    component: currentComponent(),
    setCurrentView,
  };

  return (
    <ShittyRouterContext.Provider value={value}>
      {children}
    </ShittyRouterContext.Provider>
  );
}

export function useShittyRouter() {
  return useContext(ShittyRouterContext);
}
