import { supabase } from "@database/supabaseClient";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Account.module.scss";
import { PiUserCircleFill } from "react-icons/pi";

const AccountButton = (props) => {
	const { accountInfoDisplayed } = useContextSelector("displayStore");
	const dispatch = useContextDispatch();

	const handleFetchDB = async () => {
		const { data, error } = await supabase.from("sampletest").select("*");

		if (error) {
			console.error("Check database", error);
		} else {
			console.log("Return from database", data);
		}
	};

	const handleRenderToggle = async () => {
		// await handleFetchDB();

		dispatch({
			type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
			payload: !accountInfoDisplayed,
		});
	};

	return (
		<div className={styles["userComponent"]}>
			<div className={styles["icon"]}>
				<PiUserCircleFill
					className={styles["svg"]}
					style={{
						fill: "#fff",
					}}
					onMouseEnter={handleRenderToggle}
				/>
			</div>
		</div>
	);
};

export default AccountButton;
