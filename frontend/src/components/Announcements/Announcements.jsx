import { useState, React } from 'react';
import styles from './Announcements.module.scss';

const Announcements = () => {
  const [showFirstSection, setShowFirstSection] = useState(false);

  return (
    <div className={styles.container}>
      <h2>We&apos;ve just released a new update</h2>
      <h3>Check out all new dashboard view. Pages and now load faster </h3>

      {showFirstSection && (
        <div className={styles.buttons}>
          <button className={styles.dismiss}>Dismiss</button>
          <button className={styles.changelog}>Changelog</button>
        </div>
      )}

      {!showFirstSection && (
        <div>
          <h3 style={{ fontWeight: 600 }}>Subscribe to updates</h3>
          <div className={styles.buttons}>
            <input
              type="text"
              placeholder="Enter your email"
              className={styles.emailInput}
            />
            <button className={styles.changelog}>Subscribe</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
