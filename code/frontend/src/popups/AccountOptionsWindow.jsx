import LoginButton from "@components/LoginButton";
import { setUser } from "@database/users";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/AccountOptionsWindow.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [session, setSession] = useState(null);

	const { accountInfoDisplayed } = useContextSelector("displayStore");
	const { theme: currentTheme } = useContextSelector("globalStore");
	const dispatch = useContextDispatch();

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

	useEffect(() => {
		document.addEventListener("click", handleWindowRemoval);

		return () => {
			document.removeEventListener("click", handleWindowRemoval);
		};
	}, [accountInfoDisplayed, dispatch]);

	useEffect(() => {
		const authListener = setUser((session) => {
			const isUserAuthorized = session?.user?.email || false;

			setSession(session);
			setIsAuthorized(isUserAuthorized);
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

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

	const renderAccountOptions = () => {
		const optionsList = [
			{
				name: "Profile",
			},
			{
				name: "Your Items",
			},
			{
				name: "Orders",
			},
			{
				name: "Delete Account",
			},
		];

		return (
			<>
				<div className={styles["menu"]}>
					<span className={cns(styles["title"], styles["alt"])}>Your Account</span>
					<ul className={styles["list"]}>
						{optionsList.map((option, i) => {
							return (
								<li key={i} className={styles["list-item"]}>
									<span>{option.name}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</>
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
					<div className={styles["inner"]}>
						<div className={styles["header"]}>
							<span>Hello, {isAuthorized ? session.user.user_metadata.name.split(" ")[0] : "sign in!"}</span>
						</div>
						{isAuthorized ? renderAccountOptions() : <LoginButton />}
						<hr />
						{renderThemeSwitcher()}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AccountOptionsWindow;
