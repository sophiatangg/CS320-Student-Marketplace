import LoginButton from "@components/LoginButton";
import { signOut } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/AccountOptionsWindow.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsBagPlusFill } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { HiLogin } from "react-icons/hi";
import { PiUserCircleFill } from "react-icons/pi";
import ScrollBar from "react-perfect-scrollbar";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const animationVariants = {
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			type: "spring",
		},
	},
	hidden: {
		opacity: 0,
		y: 20,
		transition: {
			duration: 0.5,
			type: "spring",
		},
	},
};

const AccountOptionsWindow = () => {
	const windowRef = useRef(null);
	const [isExiting, setIsExiting] = useState(false);

	const { currentUser, setCurrentUser } = useAuth();

	const { accountInfoDisplayed } = useContextSelector("displayStore");
	const { theme: currentTheme } = useContextSelector("globalStore");
	const dispatch = useContextDispatch();

	const navigate = useNavigate();

	const handleWindowRemoval = (e) => {
		if (windowRef.current && !windowRef.current.contains(e.target)) {
			dispatch({
				type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
				payload: false,
			});

			setIsExiting(true);
		}
	};

	const handleThemeChange = (selectedTheme) => {
		dispatch({
			type: "SET_THEME",
			payload: selectedTheme,
		});
	};

	const handleScroll = (e) => {
		e.stopPropagation();
	};

	useEffect(() => {
		document.addEventListener("click", handleWindowRemoval);

		return () => {
			document.removeEventListener("click", handleWindowRemoval);
		};
	}, [accountInfoDisplayed, dispatch]);

	const renderAccountOptions = () => {
		const optionsList = [
			{
				name: "Profile",
				icon: () => {
					return <PiUserCircleFill />;
				},
				onClick: async (e) => {
					e.preventDefault();

					dispatch({
						type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
						payload: false,
					});

					setTimeout(() => {
						dispatch({
							type: "SET_ACCOUNT_PROFILE_DISPLAYED",
							payload: true,
						});
					}, 10);
				},
			},
			{
				name: "Your Items",
				icon: () => {
					return <BsBagPlusFill />;
				},
			},
			{
				name: "Delete Account",
				icon: () => {
					return <FaTrashCan />;
				},
			},
			{
				name: "Logout",
				icon: () => {
					return <HiLogin />;
				},
				onClick: async (e) => {
					const logOut = await signOut(e);
					const { error } = logOut;

					if (error) {
						toast.error("Error signing out.", {
							position: "top-center",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "dark",
							transition: Bounce,
						});
					} else {
						navigate(0);
					}
				},
			},
		];

		return (
			<>
				<div className={styles["menu"]}>
					<span className={cns(styles["title"], styles["alt"])}>Your Account</span>
					<ul className={styles["list"]}>
						{optionsList.map((option, i) => {
							return (
								<li
									key={i}
									className={cns(styles["list-item"], {
										[styles["delete-item"]]: option.name === "Delete Account",
										[styles["logout-item"]]: option.name === "Logout",
									})}
									onClick={async (e) => {
										if (!option.onClick) return;
										await option.onClick(e);
									}}
								>
									<div className={styles["list-item-inner"]}>
										<span className={styles["list-icon"]}>{option.icon && option.icon()}</span>
										<span className={styles["list-name"]}>{option.name}</span>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</>
		);
	};

	const renderThemeSwitcher = () => {
		const themes = ["dark", "light", "system"];

		return (
			<div className={styles["appearanceGroup"]}>
				<span className={styles["title"]}>APPEARANCE</span>
				<div className={styles["group"]}>
					{themes.map((theme, i) => {
						return (
							<div
								key={i}
								className={cns(styles["groupItem"], {
									[styles["groupSelectedItem"]]: currentTheme === theme,
								})}
								onClick={() => {
									handleThemeChange(theme);
								}}
							>
								<div className={styles["groupPhoto"]}>
									<img src={`/themes/theme-${theme}.png`} />
								</div>
								<span className={styles["groupItemName"]}>{theme}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<AnimatePresence key={"window"}>
			{accountInfoDisplayed && (
				<motion.div
					ref={windowRef}
					className={styles["accountOptions"]}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={animationVariants}
					onAnimationComplete={(definition) => {
						if (definition === "hidden" && isExiting) {
							dispatch({
								type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
								payload: false,
							});

							setIsExiting(false);
						}
					}}
				>
					<ScrollBar
						options={{
							wheelSpeed: 0.5,
						}}
						onWheel={handleScroll}
					>
						<div className={styles["inner"]}>
							<div className={styles["header"]}>
								<span>Hello, {currentUser ? currentUser.user_metadata.name.split(" ")[0] : "sign in!"}</span>
							</div>
							{currentUser ? renderAccountOptions() : <LoginButton />}
							<hr />
							{renderThemeSwitcher()}
						</div>
					</ScrollBar>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AccountOptionsWindow;
