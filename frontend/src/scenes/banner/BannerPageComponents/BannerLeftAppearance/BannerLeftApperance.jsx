import { React } from 'react';
import styles from './BannerLeftApperance.module.scss';
import ColorTextField from '@components/ColorTextField/ColorTextField';

const BannerLeftAppearance = ({ backgroundColor, setBackgroundColor, fontColor, setFontColor }) => {

    return (
        <div className={styles.container}>
            <h2 style={{marginTop: '1.5rem', marginBottom: '11.2px'}}>Background Color</h2>
            <div className={styles.color}>
                <ColorTextField
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                />
            </div>
            <h2>Font Color</h2>
            <div className={styles.color}>
                <ColorTextField
                    value={fontColor}
                    onChange={setFontColor}
                />
            </div>
        </div>
    );
};

export default BannerLeftAppearance;
