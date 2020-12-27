import Head from 'next/head';
import { useEffect, useState, DependencyList, Dispatch, SetStateAction } from 'react';

export default function Home() {
    return (
        <>
            <Head>
                <title>Jergus Lejko</title>
            </Head>

            <div className="h-screen px-20 py-16">
                <div className="flex flex-col justify-between w-full h-full border-b-2 border-gray-300">
                    <div className="flex justify-end">
                        <Time />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between py-10">
                        <div>
                            <div className="text-8xl">Hi, I'm Jergus.</div>
                        </div>
                        <div className="text-2xl mt-8 md:mt-0 text-right">
                            <a href="#" className="inline-block w-36">
                                Read story →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Time() {
    const [date, setDate] = useState(() => new Date());
    const [mode, setMode] = usePersistentState('clock_mode', true);

    useInterval(() => setDate(new Date()), 1000, []);

    const [hours, minutes, tag] = (() => {
        if (mode) {
            return [
                date.getHours() % 12,
                date.getMinutes(),
                date.getHours() >= 12 ? 'PM' : 'AM',
            ] as const;
        }

        return [date.getHours(), date.getMinutes(), undefined] as const;
    })();

    return (
        <div onClick={() => setMode(!mode)} className="flex relative select-none">
            <span className="text-5xl">
                {hours}:{minutes}
            </span>
            &nbsp;
            {mode && <span className="absolute right-0 text-xl -mt-3 -mr-6">{tag}</span>}
        </div>
    );
}

function useInterval(fn: () => void, interval: number, deps?: DependencyList) {
    useEffect(() => {
        const id = setInterval(fn, interval);
        return () => clearInterval(id);
    }, deps);
}

function usePersistentState<T>(
    key: string,
    initial: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState(initial);

    useEffect(() => {
        if (window.localStorage.getItem(key) !== undefined) {
            setState(JSON.parse(localStorage.getItem(key)!));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [state]);

    return [state, setState];
}
