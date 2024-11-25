import styles from "@styles/LoadingBar.module.scss";

const LoadingBar = () => {
	return (
		<div className={styles.loadingBarContainer}>
			<div className={styles.loadingBar}></div>
		</div>
	);
};

export default LoadingBar;
