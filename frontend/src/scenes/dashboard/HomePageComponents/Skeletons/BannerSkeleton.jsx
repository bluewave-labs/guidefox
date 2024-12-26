import { Skeleton } from "@mui/material";
import styles from "./Skeleton.module.scss";

const BannerSkeleton = () => {
  const skeletonStyles = { bgcolor: "var(--gray-200)", borderRadius: "3.12px" };

  return (
    <div className={styles.bannerSkeletonContainer}>
      <Skeleton
        variant="rounded"
        width={80}
        height={10}
        sx={{ bgcolor: "var(--gray-300", borderRadius: "3.12px" }}
        animation={false}
      />
      <Skeleton
        variant="rectangular"
        width={210}
        height={28}
        sx={skeletonStyles}
        animation={false}
      />
      <Skeleton
        variant="rectangular"
        width={210}
        height={20}
        sx={skeletonStyles}
        animation={false}
      />

      <Skeleton
        className="childSkeleton"
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "var(--blue-50)",
        }}
        variant="rounded"
        width={260}
        height={20}
        animation={false}
      />
    </div>
  );
};

export default BannerSkeleton;
