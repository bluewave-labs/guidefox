import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingArea from "../../components/LoadingPage/LoadingArea";
import { getStatistics } from "../../services/statisticsService";
import styles from "./Dashboard.module.scss";
import CreateActivityButtonList from "./HomePageComponents/CreateActivityButtonList/CreateActivityButtonList";
import DateDisplay from "./HomePageComponents/DateDisplay/DateDisplay";
import StatisticCardList from "./HomePageComponents/StatisticCardsList/StatisticCardsList";
import UserTitle from "./HomePageComponents/UserTitle/UserTitle";
import BannerSkeleton from "./HomePageComponents/Skeletons/BannerSkeleton";
import BaseSkeleton from "./HomePageComponents/Skeletons/BaseSkeleton";

const mapMetricName = (guideType) => {
  switch (guideType) {
    case "popup":
      return "Popup views";
    case "hint":
      return "Hint views";
    case "banner":
      return "Banner views";
    case "link":
      return "Link views";
    case "tour":
      return "Tour views";
    case "checklist":
      return "Checklist views";
    default:
      return "Unknown";
  }
};

const Dashboard = ({ name }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);

  const metricNames = ['popup', 'banner', 'link']

  useEffect(() => {
    getStatistics().then((data) => {
      setMetrics(
        data
          ?.filter((metric) => metricNames.includes(metric.guideType)) 
          ?.map((metric) => ({
            metricName: mapMetricName(metric.guideType),
            metricValue: metric.views,
            changeRate: metric.change,
          }))
      );
      setIsLoading(false);
    });
  }, []);

  const buttons = [
    {
      skeletonType: <BaseSkeleton guideType="popup" />,
      placeholder: "Create a popup",
      onClick: () => navigate("/popup", { state: { autoOpen: true } }),
    },
    {
      skeletonType: <BannerSkeleton />,
      placeholder: "Create a new banner",
      onClick: () => navigate("/banner", { state: { autoOpen: true } }),
    },
    {
      skeletonType: <BaseSkeleton guideType="helperLink" />,
      placeholder: "Create a new helper link",
      onClick: () => navigate("/hint", { state: { autoOpen: true } }),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <UserTitle name={name} />
        <DateDisplay />
      </div>
      <div className={styles.text}>Start with a popular onboarding process</div>
      <CreateActivityButtonList buttons={buttons} />
      {isLoading ? <LoadingArea /> : <StatisticCardList metrics={metrics} />}
    </div>
  );
};

export default Dashboard;
