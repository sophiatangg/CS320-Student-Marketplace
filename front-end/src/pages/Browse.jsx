import AnimatedPage from "@animations/AnimatedPage";
import Grid from "@components/Grid";
import Sidebar from "@components/Sidebar";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Browse.module.scss";
import cns from "@utils/classNames";
import { useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineTableRows } from "react-icons/md";
import { TbLayoutGridFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Browse = (props) => {
	const {
		allItems,
		clearFilter,
		currentCategory,
		handleAddNewItemOpen,
		handleCurrentHoveredItem,
		handleCategorySelect,
		handleHoverItem,
		handleLike,
		handleSelectItem,
		handleTradeOpen,
		search,
		searching,
		setCurrentCategory,
		setShownItems,
		shownItems,
	} = props;

	const localStorageItems = useContextSelector("globalStore").items;

	const navigate = useNavigate();

	const dispatch = useContextDispatch();
	const gridDisplay = useContextSelector("globalStore").gridDisplay;

	const handleLayoutSwitch = (e, bool) => {
		dispatch({ type: "SET_DISPLAY", payload: bool });
	};

	useEffect(() => {
		if (currentCategory === "none") {
			setShownItems(allItems);
		} else if (currentCategory === "My Items") {
			setShownItems(localStorageItems);
		} else if (currentCategory === "Wishlist") {
			let items = allItems.filter((item) => item.isLiked === true);
			setShownItems(items);
		} else {
			let items = allItems.filter((item) => item.genre === currentCategory);
			setShownItems(items);
		}
	}, [currentCategory]);

	const isNotDefaultItemsPage = currentCategory !== "none" && (currentCategory === "Wishlist" || currentCategory === "My Items");
	const isDefaultItemsPage = currentCategory !== "none" && currentCategory !== "Wishlist" && currentCategory !== "My Items";

	const renderPlaceHolder = () => {
		return (
			isNotDefaultItemsPage && (
				<div className={styles["placeholder"]}>
					<button
						className={styles["textButton"]}
						onClick={(e) => {
							setCurrentCategory("none");
						}}
					>
						<span className={styles["icon"]}>
							<FaArrowLeftLong style={{ width: 18, height: 18 }} />
						</span>
						<span>Back</span>
					</button>
				</div>
			)
		);
	};

	return (
		<>
			<section className={cns(styles["browse"], {})}>
				<AnimatedPage exitBeforeEnter>
					<div className={styles["browseContent"]}>
						<Sidebar allItems={allItems} handleCategorySelect={handleCategorySelect} currentCategory={currentCategory} />

						<div className={cns(styles["list"], {})}>
							<div className={styles["applied"]}>
								<div className={styles["left"]}>
									{isNotDefaultItemsPage && <>{renderPlaceHolder()}</>}
									{currentCategory === "My Items" && (
										<div className={styles["addNewItem"]}>
											<button
												className={styles["textButton"]}
												onClick={(e) => {
													if (handleAddNewItemOpen) handleAddNewItemOpen(true);
												}}
											>
												Add Item
											</button>
										</div>
									)}
									{isDefaultItemsPage && (
										<div className={styles["filterList"]}>
											<button className={styles["textButton"]} aria-label="Current Filter">
												Filter by:
												<span> {currentCategory}</span>
											</button>
											{currentCategory !== "none" && (
												<button
													className={`${styles["textButton"]} ${styles["clearButton"]}`}
													onClick={clearFilter}
													aria-label="Clear Filters"
												>
													Clear Filter
												</button>
											)}
										</div>
									)}
								</div>

								<div className={styles["displayStyle"]}>
									<p>Display options:</p>
									<button
										className={styles["displayBtn"]}
										onClick={(e) => {
											handleLayoutSwitch(e, true);
										}}
										id="grid"
										aria-label="Display grids"
									>
										<TbLayoutGridFilled
											className={styles["displayItem"]}
											style={{ width: 30, height: 30, fill: gridDisplay ? "#e5e5e5" : "#6f6f6f" }}
										/>
									</button>

									<button
										className={styles["displayBtn"]}
										onClick={(e) => {
											handleLayoutSwitch(e, false);
										}}
										id="columns"
										aria-label="Display columns"
									>
										<MdOutlineTableRows
											className={styles["displayItem"]}
											style={{ width: 30, height: 30, fill: gridDisplay ? "#6f6f6f" : "#e5e5e5" }}
										/>
									</button>
								</div>
							</div>

							<Grid
								gridDisplay={gridDisplay}
								handleCurrentHoveredItem={handleCurrentHoveredItem}
								handleHoverItem={handleHoverItem}
								handleLike={handleLike}
								handleSelectItem={handleSelectItem}
								handleTradeOpen={handleTradeOpen}
								search={search}
								searching={searching}
								shownItems={shownItems}
							/>
						</div>
					</div>
				</AnimatedPage>
			</section>
		</>
	);
};

export default Browse;
