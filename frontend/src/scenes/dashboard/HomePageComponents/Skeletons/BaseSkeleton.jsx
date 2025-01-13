import { Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './Skeleton.module.scss';
import { baseSkeletonStyles, commonSkeletonStyles } from './BaseSkeletonStyles';

const BaseSkeleton = ({ guideType, items = 4, children }) => {
  const guideTypeStyles = baseSkeletonStyles[guideType] || {};

  return (
    <div className={styles.skeletonContainer}>
      {[...Array(items)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width={'100%'}
          height={'20%'}
          animation={false}
          sx={commonSkeletonStyles}
        />
      ))}

      <div style={guideTypeStyles}>
        <Skeleton
          className="childSkeleton"
          variant="rounded"
          width={guideTypeStyles.width || 100}
          height={guideTypeStyles.height || 50}
          animation={false}
          sx={{
            bgcolor: 'var(--blue-50)',
          }}
        />
        {children}
      </div>
    </div>
  );
};

BaseSkeleton.propTypes = {
  guideType: PropTypes.string.isRequired,
  items: PropTypes.number,
  children: PropTypes.node,
};

export default BaseSkeleton;
