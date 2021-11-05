import { useState } from "react";
import ListFilesView from "./views/ListFilesView";
import LoginView from "./views/LoginView";
import SingeFileView from "./views/SingleFileView";

export type ViewString = "login" | "list-files" | "single-file";

export default function ShittyRouter() {
  const [currentView, setCurrentView] = useState<ViewString>("login");

  const shittyRouter = () => {
    switch (currentView) {
      case "login":
        return <LoginView />;
      case "list-files":
        return <ListFilesView />;
      case "single-file":
        return <SingeFileView />;
    }
  };
  return shittyRouter();
}
