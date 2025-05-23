import CustomTable from '../../components/Table/Table';
import { getAllGuideLogs } from '../../services/guidelogService';
import { useEffect, useState, React } from 'react';
import styles from './UserStatisticsPage.module.css';

const UserStatisticsPage = () => {
  const [guideLogs, setGuideLogs] = useState([]);

  useEffect(() => {
    const fetchGuideLogs = async () => {
      try {
        const guideLogsData = await getAllGuideLogs();
        setGuideLogs(guideLogsData);
      } catch (err) {
        console.error('Error fetching guide logs:', err);
      }
    };
    fetchGuideLogs();
  }, []);

  return (
    <div className={styles.container}>
      <CustomTable fullData={guideLogs} />
    </div>
  );
};

export default UserStatisticsPage;
