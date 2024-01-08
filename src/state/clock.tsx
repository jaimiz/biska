import React from "react";

type StateContext = number;

const stateContext = React.createContext<StateContext>(0);

export function TimeTickProvider({
	children,
}: React.PropsWithChildren<NonNullable<unknown>>) {
	const [tick, setTick] = React.useState(Date.now());
	React.useEffect(() => {
		const i = setInterval(() => {
			setTick(Date.now());
		}, 60_000);
		return () => clearInterval(i);
	}, [setTick]);
	return <stateContext.Provider value={tick}>{children}</stateContext.Provider>;
}

export function useTickEveryMinute() {
	return React.useContext(stateContext);
}
