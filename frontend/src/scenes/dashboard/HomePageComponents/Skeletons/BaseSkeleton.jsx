import { Skeleton } from "@mui/material";
import styles from "./Skeleton.module.scss";
import { baseSkeletonStyles } from "./BaseSkeletonStyles";

const BaseSkeleton = ({ guideType, items = 4 }) => {
  const skeletonStyles = { bgcolor: "var(--gray-200)", borderRadius: "3.12px" };
  const guideTypeStyles = baseSkeletonStyles[guideType] || {};

  return (
    <div className={styles.skeletonContainer}>
      {[...Array(items)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width={210}
          height={18}
          animation={false}
          sx={skeletonStyles}
        />
      ))}

      <Skeleton
        className="childSkeleton"
        variant="rounded"
        width={guideTypeStyles.width || 100}
        height={guideTypeStyles.height || 50}
        animation={false}
        sx={{
          ...guideTypeStyles,
          bgcolor: "var(--blue-50)",
        }}
      />
    </div>
  );
};

export default BaseSkeleton;
