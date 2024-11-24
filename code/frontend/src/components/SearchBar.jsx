import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/SearchBar.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdOutlineManageSearch } from "react-icons/md";
import { useLocation, useSearchParams } from "react-router-dom";

const searchVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const SearchBar = (props) => {
	const [searchVal, setSearchVal] = useState("");
	const [searchHover, setSearchHover] = useState(false);
	const [isWide, setIsWide] = useState(false);

	const submittedQueryTermRef = useRef(null);
	const queryButtonRemoveRef = useRef(null);

	const dispatch = useContextDispatch();
	const { searchQuery } = useContextSelector("searchStore");
	const [searchParams, setSearchParams] = useSearchParams();

	const { pathname } = useLocation();

	const handleSearch = (e) => {
		const val = e.target.value;
		setSearchVal(val);
	};

	const handleSearchSubmit = (e) => {
		if (e.key !== "Enter" || !searchVal.trim()) return;
		e.preventDefault();

		dispatch({
			type: "SET_SEARCH_QUERY",
			payload: searchVal,
		});

		setSearchVal("");

		setSearchParams({
			q: searchVal,
		});
	};

	const handleRemoveSearchQuery = () => {
		const interactiveGroup = submittedQueryTermRef.current;
		const displacementMap = document.querySelector(`#dissolve-filter feDisplacementMap`);
		const bigNoise = document.querySelector(`#dissolve-filter feTurbulence[result="bigNoise"]`);

		let isAnimating = false;

		const setRandomSeed = () => {
			const randomSeed = Math.floor(Math.random() * 1000);
			bigNoise.setAttribute("seed", randomSeed);
		};

		const easeOutCubic = (t) => {
			return 1 - Math.pow(1 - t, 3);
		};

		const maxDisplacementScale = 300;
		setRandomSeed();

		const duration = 600;
		const opacityStart = 0.5;
		const startTime = performance.now();

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeOutCubic(progress);

			const displacementScale = easedProgress * maxDisplacementScale;
			displacementMap.setAttribute("scale", displacementScale);

			const scaleFactor = 1 + 0.2 * easedProgress;
			interactiveGroup.style.transform = `scale(${scaleFactor})`;

			let opacity = 1;
			if (easedProgress > opacityStart) {
				opacity = 1 - (easedProgress - opacityStart) / (1 - opacityStart);
			}

			interactiveGroup.style.opacity = opacity;

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setTimeout(() => {
					interactiveGroup.style.opacity = 1;
					interactiveGroup.style.transform = "scale(1)";
					displacementMap.setAttribute("scale", 0);
					isAnimating = false;
				}, 500);
			}
		};

		requestAnimationFrame(animate);

		setTimeout(() => {
			dispatch({
				type: "CLEAR_SEARCH_QUERY",
			});

			setSearchParams({});
		}, 500);
	};

	const handleSearchHoverToggle = (e) => {
		e.preventDefault();

		setSearchHover(!searchHover);
	};

	const handleWindowResize = () => {
		setIsWide(window.innerWidth <= 900);
	};

	useEffect(() => {
		const query = searchParams.get("q") || "";
		setSearchVal(query);

		dispatch({
			type: "SET_SEARCH_QUERY",
			payload: query,
		});
	}, [searchParams, dispatch]);

	useEffect(() => {
		handleWindowResize();

		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	const renderElem = () => {
		return (
			<motion.div
				className={cns(styles["search"], {
					[styles["searchWide"]]: isWide,
				})}
				animate="visible"
				initial={pathname === "/browse" ? "hidden" : "visible"}
				variants={searchVariants}
				transition={{ opacity: { type: "spring" }, duration: 0.01, delay: 0.25 }}
				onMouseEnter={handleSearchHoverToggle}
				onMouseLeave={handleSearchHoverToggle}
			>
				<div className={cns(styles["searchInner"], {})}>
					<div
						className={cns(styles["icon"], {
							[styles["hasQuery"]]: searchQuery,
						})}
					>
						<HiSearch style={{ fill: searchHover ? "#fff" : "#cccccc" }} id="7" aria-label="Search" />
					</div>
					{searchQuery ? (
						<div className={styles["submittedQuery"]}>
							<div ref={submittedQueryTermRef} className={styles["queryTerm"]}>
								<div className={styles["queryTermIcon"]}>
									<MdOutlineManageSearch />
								</div>
								<div className={styles["queryTermInner"]}>
									<span className={styles["keywordTerm"]}>{searchQuery}</span>
								</div>
							</div>
							<div ref={queryButtonRemoveRef} onClick={handleRemoveSearchQuery} className={styles["removeQueryButton"]}>
								<IoClose />
							</div>
						</div>
					) : (
						<input placeholder="Search items..." value={searchVal} onChange={handleSearch} onKeyDown={handleSearchSubmit} />
					)}
				</div>
			</motion.div>
		);
	};

	return renderElem();
};

export default SearchBar;
