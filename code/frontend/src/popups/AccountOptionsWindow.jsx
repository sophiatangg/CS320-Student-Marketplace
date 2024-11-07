import Window from "@popups/Window";
import styles from "@styles/AccountOptionsWindow.module.scss";

const AccountOptionsWindow = (props) => {
	return (
		<Window dispatchType={"SET_ACCOUNT_OPTIONS_DISPLAYED"}>
			<div className={styles["accountOptions"]} style={{ backgroundColor: "var(--popOutBgColor)" }}></div>
		</Window>
	);
};

export default AccountOptionsWindow;
