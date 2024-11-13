import AddNewItemButton from "@components/AddNewItemButton";
import Grid from "@components/Grid";
import Sidebar from "@components/Sidebar";
import { setUser } from "@database/users";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Browse.module.scss";
import cns from "@utils/classNames";
import { PROJECT_NAME } from "@utils/main";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineTableRows } from "react-icons/md";
import { TbLayoutGridFilled } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

const animations = {
	initial: { opacity: 0, x: -150 },
	animate: { opacity: 1, x: 0, transition: { x: { type: "spring", duration: 0.9, bounce: 0.4 } } },
	exit: { opacity: 0, x: 150, transition: { x: { type: "tween", duration: 0.4, bounce: 0.3 } } },
};

const Browse = (props) => {
	const [isAuthorized, setIsAuthorized] = useState(false);

	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const categoryName = params.get("cat") || "";

	const { gridDisplay } = useContextSelector("globalStore");
	const dispatch = useContextDispatch();

	const navigate = useNavigate();

	const handleLayoutSwitch = (e, bool) => {
		dispatch({ type: "SET_DISPLAY", payload: bool });
	};

	useEffect(() => {
		document.title = `${PROJECT_NAME} — Store`;
	}, []);

	useEffect(() => {
		const authListener = setUser((session) => {
			const isUserAuthorized = session?.user?.email || false;

			setIsAuthorized(isUserAuthorized || false);

			if (!isUserAuthorized) {
				navigate("/login");
			}
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, [isAuthorized]);

	const renderPlaceHolder = () => {
		return (
			<div className={styles["placeholder"]}>
				<button className={styles["textButton"]} onClick={(e) => {}}>
					<span className={styles["icon"]}>
						<FaArrowLeftLong style={{ width: 18, height: 18 }} />
					</span>
					<span>Back</span>
				</button>
			</div>
		);
	};

	const isNotDefaultItemsPage = !categoryName && categoryName === "all" && (categoryName === "wishlist" || categoryName === "my-items");

	return (
		<>
			<section className={cns(styles["browse"], {})}>
				<motion.div variants={animations} initial="initial" animate="animate" exit="exit">
					<div className={styles["browseContent"]}>
						<Sidebar />
						<div className={cns(styles["list"], {})}>
							<div className={styles["applied"]}>
								<div className={styles["left"]}>
									{isNotDefaultItemsPage && renderPlaceHolder()}
									{categoryName === "my-items" && <AddNewItemButton />}
								</div>
								<div className={styles["displayStyle"]}>
									<span>Display options:</span>
									<button
										className={cns(styles["displayBtn"], {
											[styles["isActive"]]: gridDisplay,
										})}
										id="grid"
										style={{
											pointerEvents: gridDisplay ? "none" : "",
										}}
										aria-label="Display grids"
										onClick={(e) => {
											handleLayoutSwitch(e, true);
										}}
									>
										<TbLayoutGridFilled
											className={cns(styles["displayItem"], {})}
											style={{ width: 30, height: 30, fill: gridDisplay ? "#e5e5e5" : "#6f6f6f" }}
										/>
									</button>
									<button
										className={cns(styles["displayBtn"], {
											[styles["isActive"]]: !gridDisplay,
										})}
										id="columns"
										style={{
											pointerEvents: !gridDisplay ? "none" : "",
										}}
										aria-label="Display columns"
										onClick={(e) => {
											handleLayoutSwitch(e, false);
										}}
									>
										<MdOutlineTableRows
											className={styles["displayItem"]}
											style={{ width: 30, height: 30, fill: gridDisplay ? "#6f6f6f" : "#e5e5e5" }}
										/>
									</button>
								</div>
							</div>
							<Grid />
						</div>
					</div>
				</motion.div>
			</section>
		</>
	);
};

export default Browse;
