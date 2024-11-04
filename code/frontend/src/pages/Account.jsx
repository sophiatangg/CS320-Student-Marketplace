import { supabase } from "@database/supabaseClient";
import styles from "@styles/Account.module.scss";
import { PiUserCircleFill } from "react-icons/pi";

const Account = (props) => {
	const handleFetchDB = async () => {
		const { data, error } = await supabase.from("sampletest").select("*");

		if (error) {
			console.error("Check database", error);
		} else {
			console.log("Return from database", data);
		}
	};

	const handleClick = async () => {
		await handleFetchDB();
	};

	return (
		<div className={styles["userComponent"]}>
			<div className={styles["icon"]} onClick={handleClick}>
				<PiUserCircleFill
					className={styles["svg"]}
					style={{
						fill: "#fff",
					}}
				/>
			</div>
		</div>
	);
};

export default Account;
