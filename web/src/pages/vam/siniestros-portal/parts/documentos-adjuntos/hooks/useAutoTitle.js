import {useEffect} from "react";

export const useAutoTitle = (ref) => {
    useEffect(() => {
        const current = ref.current;
        if (!current) return;
        if (current.offsetWidth < current.scrollWidth) ref.current.title = current.innerText;
    }, [ref?.current?.offsetWidth]);
}