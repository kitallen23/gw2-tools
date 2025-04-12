import { Theme } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";

import Layout from "@/components/Layout/Layout";
import { radixTheme } from "@/styles/global.css";
import { useTheme } from "@/utils/useTheme";

function App() {
    const { mode } = useTheme();
    return (
        <Theme
            appearance={mode}
            accentColor="gray"
            grayColor="gray"
            scaling="100%"
            panelBackground="solid"
            className={radixTheme}
        >
            <Layout>
                <Outlet />
            </Layout>
        </Theme>
    );
}

export default App;
