// in src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Step1 from "../pages/Onboarding/Step1";
import Step2 from "../pages/Onboarding/Step2";
import Step3 from "@/pages/Onboarding/Step3";
import Step4 from "@/pages/Onboarding/step4";
import Step5 from "@/pages/Onboarding/Step5";
import Step6 from "@/pages/Onboarding/Step6";


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Step1 /> },
      { path: "/onboarding/step-1", element: <Step1 /> },
      { path: "/onboarding/step-2", element: <Step2 /> },
      { path: "/onboarding/step-3", element: <Step3 /> },
      { path: "/onboarding/step-4", element: <Step4 /> },
      { path: "/onboarding/step-5", element: <Step5 /> },
      { path: "/onboarding/step-6", element: <Step6 /> },
      { path: "/home", element: <Home /> },
    ],
  },
]);
