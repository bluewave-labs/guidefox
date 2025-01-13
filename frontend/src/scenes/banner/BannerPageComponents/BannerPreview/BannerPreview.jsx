import styles from './BannerPreview.module.scss'
import { React } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const BannerPreview = ({ bannerText = '',
    setBannerText = () => null,
    backgroundColor = 'var(--light-purple-background)',
    color = 'var(--main-text-color)',
    isTopPosition = true }) => {

    const handleChange = (event) => {
        setBannerText(event.target.value);
    };
    const banner = (
        <div className={styles.banner} style={{ backgroundColor: backgroundColor, color: color }}>
            <span />
            <input
                type="text"
                className={styles.bannertext}
                placeholder="Change the Banner Text Here"
                value={bannerText}
                onChange={handleChange} 
                style={{color: color}}
            />            
            <CloseOutlinedIcon style={{ color: color, fontSize: '20px' }} />
        </div>
    );

    return (
        <div className={styles.container}>
            <h2>Preview</h2>
            <div className={styles.preview}>
                {isTopPosition && banner}
                <div className={styles.bannerOne}></div>
                <div className={styles.bannerTwo}></div>
                <div className={styles.bannerThree}></div>
                <div className={styles.bannerFour}></div>
                {!isTopPosition && banner}
            </div>
        </div>
    );
};

export default BannerPreview;