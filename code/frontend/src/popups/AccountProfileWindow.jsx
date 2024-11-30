import { getUser } from "@database/users";
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/AccountProfileWindow.module.scss";
import cns from "@utils/classNames";
import { formattedDate, isValidISODate } from "@utils/formatDate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountProfileWindow = (props) => {
	const { currentUser } = useAuth();

	const [userInfo, setUserInfo] = useState({});

	const { selectedUserId } = useContextSelector("globalStore");
	const dispatch = useContextDispatch();

	const navigate = useNavigate();

	const isOwnProfile = currentUser.id === selectedUserId;

	useEffect(() => {
		if (!selectedUserId) return;

		if (isOwnProfile) {
			setUserInfo({
				id: currentUser.id,
				email: currentUser.user_metadata.email,
				name: currentUser.user_metadata.full_name,
				avatarURL: currentUser.user_metadata.avatar_url,
				createdAt: currentUser.created_at,
				lastSignInAt: currentUser.last_sign_in_at,
			});
		} else {
			getUser(selectedUserId)
				.then((res) => {
					setUserInfo({
						id: res.id,
						email: res.email,
						name: res.name,
						avatarURL: res.avatar_url,
						createdAt: res.created_at,
					});
				})
				.catch((error) => {
					dispatch({
						type: "SET_SELECTED_USER_ID",
						payload: null,
					});
				});
		}
	}, [currentUser, selectedUserId]);

	const handleWishlistRedirect = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_ACCOUNT_PROFILE_DISPLAYED",
			payload: false,
		});

		window.scrollTo(0, 0);

		navigate(`/browse?cat=wishlist&id=${selectedUserId}`);
	};

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

	const renderViewWishListButton = () => {
		if (isOwnProfile) return null;

		return (
			<>
				<div className={styles["miscButtons"]}>
					<div className={styles["buttonLink"]} onClick={handleWishlistRedirect}>
						<span>View {userInfo.name}'s Wishlist</span>
					</div>
				</div>
			</>
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
										{userInfo.avatarURL ? <img src={userInfo.avatarURL} /> : <div className={styles["avatarNotFound"]} />}
									</div>
								</div>
								<div className={styles["name"]}>
									<span>{userInfo.name}</span>
								</div>
							</div>
						</div>
						<div className={styles["misc"]}>
							{isOwnProfile &&
								renderDetailWithLabel({
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
							{userInfo.lastSignInAt &&
								renderDetailWithLabel({
									prop: userInfo.lastSignInAt,
									label: "Last Sign In",
								})}

							{renderViewWishListButton()}
						</div>
					</div>
				</div>
			</Window>
		</>
	);
};

export default AccountProfileWindow;
