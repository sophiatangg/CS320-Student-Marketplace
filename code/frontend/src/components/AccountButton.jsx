import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/AccountButton.module.scss";
import cns from "@utils/classNames";
import { useEffect, useRef, useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { useLocation } from "react-router-dom";

const AccountButton = (props) => {
	const { userAvatar } = props;

	const [isClicked, setIsClicked] = useState(false);
	const [isHome, setIsHome] = useState(false);

	const componentRef = useRef(null);

	const { pathname } = useLocation();

	const { accountInfoDisplayed } = useContextSelector("displayStore");
	const dispatch = useContextDispatch();

	const handleClick = () => {
		setIsClicked(!isClicked);
	};

	useEffect(() => {
		setIsHome(pathname !== "/");
	}, [pathname]);

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
			}}
		>
			<div
				className={cns(styles["icon"], {
					[styles["userSignedIn"]]: userAvatar !== "",
					[styles["iconHome"]]: !isHome,
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
			{isHome && (
				<div className={styles["title"]}>
					<span>You</span>
				</div>
			)}
		</div>
	);
};

export default AccountButton;
