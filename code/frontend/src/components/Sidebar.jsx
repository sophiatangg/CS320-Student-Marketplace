import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Sidebar.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiSolidFridge, BiSolidShoppingBags } from "react-icons/bi";
import { BsBagPlusFill } from "react-icons/bs";
import { FaBarsStaggered, FaCalendarDays, FaChevronRight } from "react-icons/fa6";
import { GiLaptop, GiPoloShirt } from "react-icons/gi";
import { IoIosPricetags } from "react-icons/io";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { SiMicrosoftacademic, SiWish } from "react-icons/si";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

const defaultBGColor = "#2d2d2d";
const defaultSelectedBGColor = "#ffffff";
const defaultHoverIconColor = "#000000";

const variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

const Sidebar = (props) => {
	const [collapsedButtonShown, setCollapsedButtonShown] = useState(false);
	const [isAscending, setIsAscending] = useState(true);

	const [windowDimension, setWindowDimension] = useState({
		width: 0,
		height: 0,
	});

	const componentRef = useRef(null);

	const { sidebarViews } = useContextSelector("globalStore");
	const { allItems, shownItems } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const categoryName = params.get("cat") || "all";
	const sortPropName = params.get("spn") || "date";
	const sortPropType = params.get("spt") || "asc";

	const uniqueCategoriesFromList = [...new Set(allItems.map((item) => item.category))];
	const sortedUniqueCategories = uniqueCategoriesFromList
		.map((category) => {
			return String(category).charAt(0).toUpperCase() + String(category).slice(1);
		})
		.sort();

	const categoryList = ["All", "My Items", "Wishlist", ...sortedUniqueCategories];

	const sortSelection = [
		{
			name: "Date",
			icon: FaCalendarDays,
			onClick: () => {
				params.set("spn", "date");
				navigate(`${location.pathname}?${params.toString()}`);
			},
		},
		{
			name: "Name",
			icon: FaBarsStaggered,
			onClick: () => {
				params.set("spn", "name");
				navigate(`${location.pathname}?${params.toString()}`);
			},
		},
		{
			name: "Price",
			icon: IoIosPricetags,
			onClick: () => {
				params.set("spn", "price");
				navigate(`${location.pathname}?${params.toString()}`);
			},
		},
	];

	const sortType = [
		{
			name: "Ascending",
			icon: TbSortAscending2,
			onClick: () => {
				setIsAscending(true);

				params.set("spt", "asc");
				navigate(`${location.pathname}?${params.toString()}`);
			},
		},
		{
			name: "Descending",
			icon: TbSortDescending2,
			onClick: () => {
				setIsAscending(false);

				params.set("spt", "desc");
				navigate(`${location.pathname}?${params.toString()}`);
			},
		},
	];

	const [hoverStates, setHoverStates] = useState({
		categories: Array(categoryList.length).fill(false),
		sortSelection: Array(sortSelection.length).fill(false),
		sortType: Array(sortType.length).fill(false),
	});

	useEffect(() => {
		handleSetDimension();

		window.addEventListener("resize", handleSetDimension);

		return () => {
			window.removeEventListener("resize", handleSetDimension);
		};
	}, []);

	useEffect(() => {
		// Dynamically update the length of the category list based from hover states
		if (hoverStates.categories.length === categoryList.length) return;

		setHoverStates((prev) => ({
			...prev,
			categories: Array(categoryList.length).fill(false),
		}));
	}, [categoryList.length]);

	const handleItemHover = ({ propName, index, isHover }) => {
		setHoverStates((prev) => ({
			...prev,
			[propName]: prev[propName].map((hover, hoverIndex) => {
				return hoverIndex === index ? isHover : hover;
			}),
		}));
	};

	const handleCategorySelect = ({ name }) => {
		navigate(`/browse?cat=${name.toLowerCase().replace(" ", "-")}&page=1`);
	};

	const handleToggleSorterList = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_SIDEBAR_VIEW",
			payload: {
				key: "general",
				value: !sidebarViews.general,
			},
		});
	};

	const handleToggleCategoryList = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_SIDEBAR_VIEW",
			payload: {
				key: "category",
				value: !sidebarViews.category,
			},
		});
	};

	const handleSetDimension = () => {
		if (!componentRef.current) return;
		if (!componentRef.current.parentElement) return;

		const { width, height } = componentRef.current.parentElement.getBoundingClientRect();

		setWindowDimension({
			width: width,
			height: height,
		});
	};

	const handleToggleContentVisibilityWhenCollapsed = (e) => {
		e.preventDefault();
		setCollapsedButtonShown(!collapsedButtonShown);
	};

	const handleResetPage = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		params.set("page", 1);
		navigate(`${location.pathname}?${params.toString()}`);
	};

	const renderSorterList = (listName, arr) => {
		return arr.map((item, itemIdx) => {
			const isHovered = hoverStates[listName][itemIdx];
			const isSelected =
				(listName === "sortSelection" && sortPropName === item.name.toLowerCase()) ||
				(listName === "sortType" && sortPropType === (item.name === "Ascending" ? "asc" : item.name === "Descending" ? "desc" : ""));

			return (
				<div
					key={itemIdx}
					id={itemIdx + 1}
					className={cns(styles["filterDiv"], {
						[styles["selected"]]: isSelected,
						[styles["filterListDisabled"]]: shownItems.length === 0,
					})}
					onClick={async (e) => {
						e.preventDefault();

						if (item.onClick) {
							try {
								const { data, error } = await selectAllItemsWithImages({
									limit: itemsPerPage,
									offset: offset,
									sortPropName: sortPropName,
									sortPropType: sortPropType,
								});

								if (error) {
									throw new Error("Error fetching data.");
								}

								dispatch({
									type: "SET_ALL_ITEMS",
									payload: data,
								});
							} catch (error) {}

							item.onClick();
						}

						handleResetPage();
					}}
					onMouseEnter={() => {
						handleItemHover({
							propName: listName,
							index: itemIdx,
							isHover: !isHovered,
						});
					}}
					onMouseLeave={() => {
						handleItemHover({
							propName: listName,
							index: itemIdx,
							isHover: !isHovered,
						});
					}}
				>
					<button
						className={styles["filterBtn"]}
						style={{
							backgroundColor: isHovered || isSelected ? defaultSelectedBGColor : defaultBGColor,
						}}
					>
						<item.icon
							className={styles["filterSVG"]}
							style={{
								width: 30,
								height: 30,
								color: isHovered || isSelected ? defaultHoverIconColor : defaultSelectedBGColor,
								fill: isHovered || isSelected ? defaultHoverIconColor : defaultSelectedBGColor,
							}}
						/>
					</button>
					<span>{item.name}</span>
				</div>
			);
		});
	};

	const renderSorter = () => {
		return (
			sidebarViews.general && (
				<>
					{renderSorterList("sortSelection", sortSelection)}
					<div className={styles["filterDivSpacer"]} />
					{renderSorterList("sortType", sortType)}
				</>
			)
		);
	};

	const renderCategoryFilterSVG = (filterName, isHover) => {
		const style = {
			width: 30,
			height: 30,
			fill: isHover ? defaultHoverIconColor : defaultSelectedBGColor,
		};

		const className = styles["filterSVG"];

		switch (filterName) {
			case "My Items":
				return <BsBagPlusFill className={className} style={style} />;
			case "Wishlist":
				return <SiWish className={className} style={style} />;
			case "All":
				return <BiSolidShoppingBags className={className} style={style} />;
			case "Academic":
				return <SiMicrosoftacademic className={className} style={style} />;
			case "Apparel":
				return <GiPoloShirt className={className} style={style} />;
			case "Appliance":
			case "Appliances":
				return <BiSolidFridge className={className} style={style} />;
			case "Other":
			case "Others":
			case "Misc":
				return <RiShoppingBag3Fill className={className} style={style} />;
			case "Tech":
				return <GiLaptop className={className} style={style} />;
			default:
				return <div className={className} style={style} />;
		}
	};

	const renderCategoryList = ({ start, end }) => {
		const list = end || end === 0 ? categoryList.slice(start, end) : categoryList.slice(start);

		return list.map((categoryItemName, categoryIndex) => {
			const currentIndex = start + categoryIndex;
			const isSelected = categoryItemName.toLowerCase().replace(" ", "-") === categoryName;
			const isHovered = hoverStates["categories"][currentIndex];

			return (
				<div
					key={currentIndex}
					id={currentIndex}
					className={cns(styles["filterDiv"], {
						[styles["selected"]]: isSelected,
						[styles["hovered"]]: isHovered,
					})}
					onMouseEnter={(e) => {
						e.preventDefault();

						handleItemHover({
							propName: "categories",
							index: currentIndex,
							isHover: !isHovered,
						});
					}}
					onMouseLeave={(e) => {
						e.preventDefault();

						handleItemHover({
							propName: "categories",
							index: currentIndex,
							isHover: !isHovered,
						});
					}}
					onClick={(e) => {
						e.preventDefault();

						handleCategorySelect({
							name: categoryItemName,
						});
					}}
				>
					<button
						className={styles["filterBtn"]}
						style={{ backgroundColor: isHovered || isSelected ? defaultSelectedBGColor : defaultBGColor }}
					>
						{renderCategoryFilterSVG(categoryItemName, isHovered)}
					</button>
					<span>{categoryItemName}</span>
				</div>
			);
		});
	};

	const renderList = () => {
		return (
			<>
				<div className={styles["filterList"]}>{renderCategoryList({ start: 0, end: 3 })}</div>
				<div
					className={cns(styles["filterList"], {
						[styles["filterListHidden"]]: !sidebarViews.general,
					})}
				>
					<div
						className={cns(styles["filterListHeader"], styles["filterListHeaderClickable"])}
						onClick={(e) => {
							handleToggleSorterList(e);
						}}
					>
						<span
							className={cns(styles["filterListHeaderIcon"], {
								[styles["contentVisible"]]: sidebarViews.general,
							})}
						>
							<FaChevronRight
								style={{
									fill: "#fff",
								}}
							/>
						</span>
						<h2>Sort</h2>
					</div>
					{renderSorter()}
				</div>
				<div className={styles["filterList"]}>
					<div
						className={cns(styles["filterListHeader"], styles["filterListHeaderClickable"])}
						onClick={(e) => {
							handleToggleCategoryList(e);
						}}
					>
						<span
							className={cns(styles["filterListHeaderIcon"], {
								[styles["contentVisible"]]: sidebarViews.category,
							})}
						>
							<FaChevronRight
								style={{
									fill: "#fff",
								}}
							/>
						</span>
						<h2>Category</h2>
					</div>
					{sidebarViews.category && renderCategoryList({ start: 3 })}
				</div>
			</>
		);
	};

	const renderShowButton = () => {
		return (
			<div className={styles["filterShowButton"]} onClick={handleToggleContentVisibilityWhenCollapsed}>
				<span>Show Filters</span>
			</div>
		);
	};

	const componentCollapsible = windowDimension.width <= 610;

	return (
		<div
			ref={componentRef}
			className={cns(styles["filters"], {
				[styles["filtersCollapsed"]]: componentCollapsible,
				[styles["filtersContentVisible"]]: collapsedButtonShown,
			})}
		>
			{componentCollapsible && renderShowButton()}
			{collapsedButtonShown && (
				<motion.div className={styles["filterListAnimated"]} variants={variants} initial="initial">
					{renderList()}
				</motion.div>
			)}
			{!componentCollapsible && !collapsedButtonShown && renderList()}
		</div>
	);
};

export default Sidebar;
