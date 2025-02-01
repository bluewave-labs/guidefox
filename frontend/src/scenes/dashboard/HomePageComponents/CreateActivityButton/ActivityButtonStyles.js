export const activityButtonStyles = {
  display: 'flex',
  fontWeight: 400,
  aspectRatio: 1.75 / 1,
  backgroundColor: 'var(--gray-50)',
  width: '100%',
  border: '1px solid var(--grey-border)',
  borderRadius: 'var(--radius-button)',
  color: 'var(--gray-400)',
  padding: '1.5% 3%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'box-shadow 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    border: '1px solid var(--gray-250)',
    backgroundColor: 'var(--gray-100)',
    '.childSkeleton': {
      border: '1px solid var(--blue-300)',
    },
  },
};
