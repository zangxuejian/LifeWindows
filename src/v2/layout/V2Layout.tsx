import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { V2Footer } from "../components/Footer";
import { V2Header } from "../components/Header";
import { TimelineScaleProvider } from "../context/TimelineScaleProvider";
import "../styles.css";
import "../styles.refined.css";
import "../styles.timeline.css";

export function V2Layout() {
  useEffect(() => {
    document.title = "人生窗口期 - 看看你已经错过了什么，还剩下什么。";
  }, []);

  return (
    <TimelineScaleProvider>
      <div className="v2-root">
        <V2Header />
        <Outlet />
        <V2Footer />
      </div>
    </TimelineScaleProvider>
  );
}
