import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AIAnalysisPage } from "./pages/AIAnalysisPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/ai-analysis/:stockId",
    Component: AIAnalysisPage,
  },
]);
