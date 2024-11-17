import AddToCartButton from "@components/AddToCartButton";
import DeleteItemButton from "@components/DeleteItemButton";
import EditItemButton from "@components/EditItemButton";
import Slider from "@components/Slider";
import TradeButton from "@components/TradeButton";
import WishlistButton from "@components/WishlistButton";
import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/ItemPage.module.scss";
import cns from "@utils/classNames";
import { formatDateAgo } from "@utils/formatDate";
import { PROJECT_NAME } from "@utils/main";
import templateGame from "@utils/templateGame";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const pageAnimations = {
	initial: { opacity: 0, x: -200 },
	animate: { opacity: 1, x: 0, transition: { x: { type: "spring", duration: 0.9, bounce: 0.4 } } },
	exit: { opacity: 0, x: -200, transition: { x: { type: "tween", duration: 0.4, bounce: 0.3 } } },
};

const textAnimations = {
	initial: { opacity: 0, y: -40 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			opacity: { type: "spring", duration: 0.4, bounce: 0.5, delay: 0.4 },
			y: { type: "spring", duration: 1.25, bounce: 0.575, delay: 0.4 },
		},
	},
	exit: { opacity: 0, transition: { opacity: { type: "tween", duration: 0.2 } } },
};

const AnimatedText = ({ children }) => {
	return (
		<motion.div variants={textAnimations} initial="initial" animate="animate" exit="exit">
			{children}
		</motion.div>
	);
};

const ItemPage = (props) => {
	const { currentUser } = useAuth();

	const navigate = useNavigate();

	const [isInfoExtended, setIsInfoExtended] = useState({
		container: true,
		text: true,
	});

	const [carouselState, setCarouselState] = useState(0);
	const [isHover, setIsHover] = useState(false);
	const [isError, setIsError] = useState(false);
	const [sellerData, setSellerData] = useState(null);

	const { pathname } = useLocation();

	const { allItems, selectedItem } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const handleBrowse = async () => {
		navigate("/browse");

		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: false,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

	const handleExtendedText = () => {
		setIsInfoExtended((prev) => {
			return {
				...prev,
				text: !isInfoExtended.text,
			};
		});
	};

	const handleExtend = (e) => {
		setIsInfoExtended((prev) => {
			return {
				...prev,
				container: !isInfoExtended.container,
			};
		});

		if (!isInfoExtended.text) {
			setTimeout(handleExtendedText, 500);
		} else {
			setIsInfoExtended((prev) => {
				return {
					...prev,
					text: !isInfoExtended.text,
				};
			});
		}
	};

	const handleTradeOpen = (bool) => {
		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: bool,
		});
	};

	const handleNavigateCategory = (categoryName) => {
		if (!categoryName) return;
		if (categoryName === "") return;

		navigate(`/browse?cat=${String(categoryName).toLowerCase()}`);
	};

	useEffect(() => {
		if (pathname !== "/" && pathname !== "/browse" && !selectedItem) {
			const surname = pathname.match(/(?<=\/[^\/]+\/)[^\/]+/);

			const currentItem = allItems?.find((item) => {
				return item.surName === surname || item.surname === surname;
			});

			const item = currentItem ?? templateGame;

			document.title = `${PROJECT_NAME} — ${surname}`;

			dispatch({
				type: "SET_SELECTED_ITEM",
				payload: item,
			});
		} else {
			document.title = `${PROJECT_NAME} — ${selectedItem.name || selectedItem.name}`;
		}
	}, [pathname, selectedItem, allItems, dispatch]);

	useEffect(() => {
		if (!selectedItem || !selectedItem.hasOwnProperty("seller_id")) return;

		const fetchUser = async () => {
			if (!selectedItem?.seller_id) {
				setSellerData(null);
				return;
			}

			try {
				const res = await getUser(selectedItem.seller_id);
				setSellerData(res ?? null);
			} catch (error) {
				console.error("Error fetching seller data:", error);
				setSellerData(null);
			}
		};

		fetchUser();
	}, [selectedItem?.seller_id]);

	const renderMoreBottom = () => {
		return (
			<div
				className={cns(styles["moreBottom"], {
					[styles["conditionalOpen"]]: isInfoExtended.container,
					[styles["conditionalClose"]]: !isInfoExtended.container,
				})}
				id="about"
			>
				<AnimatedText>
					<div
						className={cns({
							[styles["open"]]: isInfoExtended.text,
							[styles["closed"]]: !isInfoExtended.text,
						})}
					>
						<h4>
							<span>Date Added:</span>
							<span>{formatDateAgo({ date: selectedItem?.created_at })}</span>
						</h4>
						<h4 className={styles["valueClickable"]}>
							<span>Seller:</span>
							<span>{sellerData?.name}</span>
						</h4>
						<h4 className={styles["valueClickable"]}>
							<span>Category:</span>
							<span
								onClick={(e) => {
									handleNavigateCategory(selectedItem?.category);
								}}
							>
								{selectedItem?.category}
							</span>
						</h4>
						<h4>
							<span>Condition:</span>
							<span>{selectedItem?.condition}</span>
						</h4>
					</div>
				</AnimatedText>
				<button
					onClick={handleExtend}
					className={cns(styles["moreBottomButton"], {
						[styles["aboutBottom"]]: isInfoExtended.container,
						[styles["aboutBottomClosed"]]: !isInfoExtended.container,
					})}
					aria-label="Extend"
				>
					<span>{isInfoExtended.container ? "Hide Details" : "More Details"}</span>
					{isInfoExtended.container ? (
						<FaChevronUp className={styles["up"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
					) : (
						<FaChevronUp className={styles["down"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
					)}
				</button>
			</div>
		);
	};

	const renderAbout = () => {
		return (
			<div className={styles["about"]}>
				<div className={styles["aboutTop"]}>
					<h1 className={styles["itemName"]}>{selectedItem ? selectedItem?.name : templateGame.name}</h1>
					<p>{selectedItem ? selectedItem?.desc : templateGame.desc}</p>
				</div>
				{renderMoreBottom()}
			</div>
		);
	};

	const renderButtons = () => {
		return (
			<div className={cns(styles["buttonContainer"], {})}>
				<div className={styles["infos"]}>
					<h3>${selectedItem ? selectedItem?.price : templateGame.price}</h3>
					{!isOwnItem && (
						<div className={styles["cart-trade"]}>
							<AddToCartButton item={selectedItem} isBig={true} />
							<TradeButton isBig={true} handleTradeOpen={handleTradeOpen} />
						</div>
					)}
				</div>
				{!isOwnItem ? (
					<WishlistButton item={selectedItem ?? templateGame} />
				) : (
					<div className={styles["delete-edit"]}>
						<DeleteItemButton isBig={true} itemId={selectedItem?.id} />
						<EditItemButton isBig={true} itemId={selectedItem?.id} />
					</div>
				)}
			</div>
		);
	};

	if (!selectedItem) return null;

	const isOwnItem = selectedItem?.seller_id === currentUser?.id;

	return (
		<>
			<div
				className={cns(styles["itemPage"], {
					[styles["notFound"]]: isError,
				})}
			>
				<motion.div variants={pageAnimations} initial="initial" animate="animate" exit="exit">
					<div className={styles["itemPageContent"]}>
						<>
							<header className={styles["itemPageHeader"]}>
								<button className={styles["goBack"]} onClick={handleBrowse} id="19" aria-label="Back">
									<FaArrowLeftLong className={styles["arrow"]} />
									Store
								</button>
							</header>
							<section className={styles["item"]}>
								{<Slider carouselState={carouselState} setCarouselState={setCarouselState} />}
								<div className={styles["itemInfo"]}>
									{renderAbout()}
									{renderButtons()}
								</div>
							</section>
						</>
					</div>
				</motion.div>
			</div>
		</>
	);
};

export default ItemPage;
