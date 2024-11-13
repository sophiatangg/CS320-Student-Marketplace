import { setUser } from "@database/users";
import Window from "@popups/Window";
import styles from "@styles/AccountProfileWindow.module.scss";
import cns from "@utils/classNames";
import { formattedDate, isValidISODate } from "@utils/formatDate";
import { useEffect, useState } from "react";

const AccountProfileWindow = (props) => {
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		const authListener = setUser((session) => {
			if (!session && !session.user) return;

			setUserInfo({
				id: session.user.id,
				email: session.user.user_metadata.email,
				name: session.user.user_metadata.full_name,
				avatarURL: session.user.user_metadata.avatar_url,
				createdAt: session.user.created_at,
				emailConfirmedAt: session.user.email_confirmed_at,
				lastSignInAt: session.user.last_sign_in_at,
			});
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	const renderPropIcon = (prop) => {};

	const renderDetailWithLabel = ({ prop, label }) => {
		const isPropDate = isValidISODate(prop);

		return (
			<div className={styles["row"]}>
				<div className={styles["label"]}>
					{renderPropIcon(prop)}
					<span className={styles["bold"]}>{label}</span>
				</div>
				<div
					className={cns(styles["value"], {
						[styles["hasDateValue"]]: isPropDate,
					})}
				>
					{isPropDate ? (
						<>
							<span>{formattedDate(prop).date}</span>
							<span>{formattedDate(prop).time}</span>
						</>
					) : (
						<span>{prop}</span>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			<Window dispatchType={"SET_ACCOUNT_PROFILE_DISPLAYED"}>
				<div className={styles["container"]}>
					<div className={styles["inner"]}>
						<div className={styles["header"]}>
							<div className={styles["headerIMG"]} />
							<div className={styles["headerInner"]}>
								<div className={styles["avatar"]}>
									<div className={styles["avatarInner"]}>
										<img src={userInfo.avatarURL} />
									</div>
								</div>
								<div className={styles["name"]}>
									<span>{userInfo.name}</span>
								</div>
							</div>
						</div>
						<div className={styles["misc"]}>
							{renderDetailWithLabel({
								prop: userInfo.email,
								label: "Email",
							})}
							{renderDetailWithLabel({
								prop: userInfo.createdAt,
								label: "Member Since",
							})}
							{renderDetailWithLabel({
								prop: userInfo.createdAt,
								label: "Email Confirmed Since",
							})}
							{renderDetailWithLabel({
								prop: userInfo.lastSignInAt,
								label: "Last Sign In",
							})}
						</div>
					</div>
				</div>
			</Window>
		</>
	);
};

export default AccountProfileWindow;
