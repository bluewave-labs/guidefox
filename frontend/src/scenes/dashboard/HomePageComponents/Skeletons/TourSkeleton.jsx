import { Skeleton } from '@mui/material';
import BaseSkeleton from './BaseSkeleton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TourSkeleton = () => (
  <BaseSkeleton guideType="tour">
    <>
      <ArrowForwardIcon
        sx={{
          position: 'absolute',
          right: '22%',
          bottom: '11%',
          zIndex: 10,
          rotate: '48deg',
          fontSize: '1rem',
          color: 'var(--blue-300)',
        }}
      />
      <Skeleton
        sx={{
          position: 'absolute',
          right: '-35%',
          bottom: '-45%',
          bgcolor: 'var(--blue-50)',
        }}
        className="childSkeleton"
        variant="rounded"
        width="60%"
        height="55%"
        animation={false}
      />
    </>
  </BaseSkeleton>
);

export default TourSkeleton;
