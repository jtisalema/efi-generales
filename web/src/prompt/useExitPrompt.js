import {useEffect, useState} from 'react';

const initBeforeUnLoad = (showExitPrompt) => {
    window.onbeforeunload = (event) => {
        if (showExitPrompt) {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = '';
            }
            return '';
        }
    };
};

// Hook
export default function useExitPrompt(bool) {
    const [showExitPrompt, setShowExitPrompt] = useState(bool);

    window.onload = function () {
        initBeforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt);

        return () => {
            initBeforeUnLoad(false);
        }
    }, [showExitPrompt]);

    return [showExitPrompt, setShowExitPrompt];
}