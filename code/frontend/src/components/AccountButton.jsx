import { supabase } from "@database/supabaseClient";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/AccountButton.module.scss";
import cns from "@utils/classNames";
import { useEffect, useRef, useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";

const AccountButton = (props) => {
	const { userAvatar } = props;

	const [isClicked, setIsClicked] = useState(false);

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

	const handleClick = () => {
		setIsClicked(!isClicked);
	};

	useEffect(() => {
		dispatch({
			type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
			payload: isClicked,
		});
	}, [isClicked]);

	return (
		<div
			ref={componentRef}
			className={styles["userComponent"]}
			onClick={(e) => {
				handleClick();
				// await handleFetchDB();
			}}
		>
			<div
				className={cns(styles["icon"], {
					[styles["userSignedIn"]]: userAvatar !== "",
				})}
			>
				{userAvatar === "" ? (
					<PiUserCircleFill
						className={styles["svg"]}
						style={{
							fill: accountInfoDisplayed ? "var(--purpleColor)" : "#fff",
						}}
					/>
				) : (
					<div
						className={styles["userIcon"]}
						style={{
							backgroundImage: `url("${userAvatar}")`,
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default AccountButton;
