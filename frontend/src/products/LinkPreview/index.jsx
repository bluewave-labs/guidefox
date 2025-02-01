import { default as CloseRoundedIcon } from '@mui/icons-material/CloseRounded';
import SupportIcon from '@mui/icons-material/Support';
import { SvgIcon } from '@mui/material';
import React, { useContext } from 'react';
import { HelperLinkContext } from '../../services/linksProvider';
import s from './Preview.module.scss';

const Preview = () => {
  const context = useContext(HelperLinkContext);
  if (!context) {
    return <div>Error: Helper Link context not found!</div>;
  }
  const { links = [], helper = {} } = context;

  const { title, headerBackgroundColor, linkFontColor, iconColor } = helper;

  return (
    <div className={s.preview} data-testid="preview">
      <h2 className={s.preview__title}>Preview</h2>
      <div className={s.preview__card}>
        <div
          className={s['preview__card--header']}
          style={{ backgroundColor: headerBackgroundColor }}
        >
          <SupportIcon style={{ color: '#667085', fontSize: '24px' }} />{' '}
          <span className={s['preview__card--title']}>{title}</span>
          <CloseRoundedIcon style={{ color: '#98A2B3', fontSize: '20px' }} />
        </div>
        <ul className={s['preview__card--links']}>
          {links
            .sort((a, b) => a.order - b.order)
            .map((it) => (
              <li key={`preview-${it.id}`} className={s['preview__card--item']}>
                <SvgIcon className={s['preview__card--icon']} fontSize="1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_601_3829)">
                      <path
                        d="M6.6668 8.66666C6.9531 9.04942 7.31837 9.36612 7.73783 9.59529C8.1573 9.82446 8.62114 9.96074 9.0979 9.99489C9.57466 10.029 10.0532 9.96024 10.501 9.79319C10.9489 9.62613 11.3555 9.36471 11.6935 9.02666L13.6935 7.02666C14.3007 6.39799 14.6366 5.55598 14.629 4.68199C14.6215 3.808 14.2709 2.97196 13.6529 2.35394C13.0348 1.73591 12.1988 1.38535 11.3248 1.37775C10.4508 1.37016 9.60881 1.70614 8.98013 2.31333L7.83347 3.45333M9.33347 7.33333C9.04716 6.95058 8.68189 6.63388 8.26243 6.4047C7.84297 6.17553 7.37913 6.03925 6.90237 6.00511C6.4256 5.97096 5.94708 6.03975 5.49924 6.20681C5.0514 6.37387 4.64472 6.63528 4.3068 6.97333L2.3068 8.97333C1.69961 9.602 1.36363 10.444 1.37122 11.318C1.37881 12.192 1.72938 13.028 2.3474 13.6461C2.96543 14.2641 3.80147 14.6147 4.67546 14.6222C5.54945 14.6298 6.39146 14.2939 7.02013 13.6867L8.16013 12.5467"
                        stroke={iconColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_601_3829">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </SvgIcon>
                <a
                  href={it.url}
                  target={it.target ? '_blank' : '_self'}
                  rel="noreferrer"
                  style={{ color: linkFontColor }}
                >
                  {it.title}
                </a>
              </li>
            ))}
        </ul>
        <p className={s['preview__card--footer']}>Powered by GuideFox</p>
      </div>
    </div>
  );
};

export default Preview;
