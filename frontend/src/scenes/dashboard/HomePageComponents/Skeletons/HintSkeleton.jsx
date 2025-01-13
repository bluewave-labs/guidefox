import { Skeleton } from '@mui/material';
import BaseSkeleton from './BaseSkeleton';

const HintSkeleton = () => (
  <BaseSkeleton guideType="hint">
    <Skeleton
      sx={{
        position: 'absolute',
        right: '23%',
        bottom: '35%',
        bgcolor: 'var(--gray-200)',
        borderRadius: 'var(--radius-skeleton)',
      }}
      variant="rounded"
      width={'30%'}
      height={'12%'}
      animation={false}
    />
  </BaseSkeleton>
);

export default HintSkeleton;
