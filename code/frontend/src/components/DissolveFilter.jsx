const DissolveFilter = () => {
	return (
		<svg width="0" height="0">
			<defs>
				<filter id="dissolve-filter" x="-200%" y="-200%" width="500%" height="500%">
					<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" result="bigNoise" />
					<feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
						<feFuncR type="linear" slope="2" intercept="-0.4" />
						<feFuncG type="linear" slope="2" intercept="-0.4" />
					</feComponentTransfer>
					<feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="2" result="fineNoise" />
					<feMerge result="combinedNoise">
						<feMergeNode in="bigNoiseAdjusted" />
						<feMergeNode in="fineNoise" />
					</feMerge>
					<feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="0" xChannelSelector="R" yChannelSelector="G" />
				</filter>
			</defs>
		</svg>
	);
};

export default DissolveFilter;
