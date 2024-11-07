import { React } from 'react';
import styles from './BannerLeftApperance.module.scss';
import ColorTextField from '@components/ColorTextField/ColorTextField';

const BannerLeftAppearance = ({ backgroundColor, setBackgroundColor, fontColor, setFontColor, isBackgroundColorValid, isFontColorValid, isBackgroundColorTouched, isFontColorTouched }) => {

    return (
        <div className={styles.container}>
            <h2>Background Color</h2>
            <div className={styles.color}>
                <ColorTextField
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                    error={!isBackgroundColorValid && isBackgroundColorTouched}
                />
                {!isBackgroundColorValid && isBackgroundColorTouched && <span className={styles.error}>Invalid hex color</span>}
            </div>
            <h2>Font Color</h2>
            <div className={styles.color}>
                <ColorTextField
                    value={fontColor}
                    onChange={setFontColor}
                    error={!isFontColorValid && isFontColorTouched}
                />
                {!isFontColorValid && isFontColorTouched && <span className={styles.error}>Invalid hex color</span>}
            </div>
        </div>
    );
};

export default BannerLeftAppearance;
