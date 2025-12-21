import React, { useEffect, useState, type BaseSyntheticEvent } from "react";

export function useOutsideClickDetector(ref: React.RefObject<HTMLElement | null>): boolean {
    const [isClickedOutside, setIsClickedOutside] = useState<boolean>(false)
    useEffect(() => {
        const listener = (event: MouseEvent | BaseSyntheticEvent | TouchEvent) => {
            setIsClickedOutside(false)
            if (ref.current) {
                if (!ref.current.contains(event.target)) {
                    setIsClickedOutside(true)
                }
            }
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref]);

    return isClickedOutside
}