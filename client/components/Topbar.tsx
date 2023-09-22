import useTheme, { Theme } from "@/hooks/useTheme";
import { HiMoon, HiSun } from "react-icons/hi";

export default function Topbar() {
    const [theme, setTheme] = useTheme();

    function handleThemeButtonClicked() {
        if (theme == Theme.DARK) setTheme(Theme.LIGHT);
        else setTheme(Theme.DARK);
    }

    return (
        <div className="w-full h-10 p-2 to-purple-500 from-blue-500 bg-gradient-to-r text-white flex justify-end">
            <button onClick={handleThemeButtonClicked}>
                {theme == Theme.LIGHT ? (
                    <HiMoon
                        size={25}
                        className="text-white pointer-events-none"
                    />
                ) : (
                    <HiSun
                        size={25}
                        className="text-white hover:animate-spin pointer-events-none"
                    />
                )}
            </button>
        </div>
    );
}
