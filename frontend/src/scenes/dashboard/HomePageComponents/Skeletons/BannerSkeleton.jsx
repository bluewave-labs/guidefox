import { Skeleton } from '@mui/material';
import styles from './Skeleton.module.scss';
import { commonSkeletonStyles } from './BaseSkeletonStyles';

const BannerSkeleton = () => {
  return (
    <div className={styles.bannerSkeletonContainer}>
      <Skeleton
        variant="rounded"
        width={'50%'}
        height={'10%'}
        sx={{
          bgcolor: 'var(--gray-300)',
          borderRadius: 'var(--radius-skeleton)',
          marginBottom: '4%',
        }}
        animation={false}
      />
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={'25%'}
        sx={commonSkeletonStyles}
        animation={false}
      />
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={'20%'}
        sx={commonSkeletonStyles}
        animation={false}
      />

      <Skeleton
        className="childSkeleton"
        sx={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'var(--blue-50)',
        }}
        variant="rounded"
        width={'105%'}
        height={'15%'}
        animation={false}
      />
    </div>
  );
};

export default BannerSkeleton;
