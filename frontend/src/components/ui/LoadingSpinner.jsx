import '../../styles/loading.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

  const spinner = <div className={`spinner ${sizeClass}`} role="status" aria-label="Loading" />;

  if (fullScreen) {
    return <div className="spinner-fullscreen">{spinner}</div>;
  }

  return <div className="spinner-container">{spinner}</div>;
};

export default LoadingSpinner;
