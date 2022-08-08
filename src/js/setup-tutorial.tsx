import { useAppSettingsStore } from './store/settings';

export const SetupTutorial = () => {
    const setShowTutorial = useAppSettingsStore((state) => state.setShowTutorial);

    return (
        <>
            Tutorial Text
            <button className="button button-secondary" onClick={() => setShowTutorial(false)}>
                Don't show this again
            </button>
        </>
    );
};
