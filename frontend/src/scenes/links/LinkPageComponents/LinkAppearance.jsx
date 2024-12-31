import { useContext, useEffect } from "react";
import { HelperLinkContext } from "../../../services/linksProvider";
import styles from "../LinkPage.module.scss";

const LinkAppearance = () => {
  const context = useContext(HelperLinkContext);
  if (!context) {
    throw new Error("LinkAppearance must be used within a HelperLinkProvider");
  }

  const { helper, setHelper } = context;

  useEffect(() => {
    document.querySelector('#header').focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHelper((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.appearance} role='form'>
      <label htmlFor='header' className={styles.appearance__label}>
        Header text{" "}
        <input
          type='text'
          id='header'
          className={styles.appearance__input}
          name='title'
          value={helper.title || ""}
          onChange={handleChange}
        />
      </label>
      <label htmlFor='header-bg' className={styles.appearance__label}>
        Header background color{" "}
        <div className={styles.appearance__color}>
          <span className={`${styles.appearance__input} ${styles.header}`}>
            {helper.headerBackgroundColor}
          </span>
          <div className={styles.appearance__circle}>
            <input
              type='color'
              id='header-bg'
              name='headerBackgroundColor'
              value={helper.headerBackgroundColor || "#F8F9F8"}
              onChange={handleChange}
            />
            <span
              className={styles["appearance__circle--mask"]}
              style={{ backgroundColor: helper.headerBackgroundColor }}
            />
          </div>
        </div>
      </label>
      <label htmlFor='link-color' className={styles.appearance__label}>
        Link font color{" "}
        <div className={styles.appearance__color}>
          <span className={`${styles.appearance__input} ${styles.link}`}>
            {helper.linkFontColor || "#344054"}
          </span>
          <div className={styles.appearance__circle}>
            <input
              type='color'
              id='link-color'
              name='linkFontColor'
              value={helper.linkFontColor || "#344054"}
              onChange={handleChange}
            />
            <span
              className={styles["appearance__circle--mask"]}
              style={{ backgroundColor: helper.linkFontColor }}
            />
          </div>
        </div>
      </label>
      <label htmlFor='icon' className={styles.appearance__label}>
        Helper icon color{" "}
        <div className={styles.appearance__color}>
          <span className={`${styles.appearance__input} ${styles.icon}`}>
            {helper.iconColor}
          </span>
          <div className={styles.appearance__circle}>
            <input
              type='color'
              id='icon'
              name='iconColor'
              value={helper.iconColor || "#7F56D9"}
              onChange={handleChange}
            />
            <span
              className={styles["appearance__circle--mask"]}
              style={{ backgroundColor: helper.iconColor }}
            />
          </div>
        </div>
      </label>
    </form>
  );
};

export default LinkAppearance;