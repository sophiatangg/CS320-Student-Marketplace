import { supabase } from "@database/supabaseClient";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import accountButtonStyles from "@styles/AccountButton.module.scss";
import { useRef } from "react";
import { PiUserCircleFill } from "react-icons/pi";

const AccountButton = (props) => {
	const {} = props;

	const componentRef = useRef(null);

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

	const handleClick = async () => {
		dispatch({
			type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
			payload: !accountInfoDisplayed,
		});
	};

	return (
		<div
			ref={componentRef}
			className={accountButtonStyles["userComponent"]}
			onClick={async () => {
				await handleFetchDB();
				handleClick();
			}}
		>
			<div className={accountButtonStyles["icon"]}>
				<PiUserCircleFill
					className={accountButtonStyles["svg"]}
					style={{
						fill: accountInfoDisplayed ? "#92f" : "#fff",
					}}
				/>
			</div>
		</div>
	);
};

export default AccountButton;
