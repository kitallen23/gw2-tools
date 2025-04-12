import { useMemo } from "react";
import { Link } from "react-router-dom";

import { HOMEPAGE } from "@/utils/constants";
import Logo from "@/components/Logo/Logo";
import {
    header,
    headerContent,
    layoutWrapper,
    logoLink,
    pageContent,
    rightOptions,
} from "@/components/Layout/Layout.css";
import { Button, Container, Text } from "@radix-ui/themes";
import { useTheme } from "@/utils/useTheme";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const Header = () => {
    const { mode, toggleMode } = useTheme();
    const logoColor = useMemo(
        () => (mode === "light" ? "dark" : "#eeeeee"),
        [mode]
    );

    return (
        <div className={header}>
            <Container
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    height: "100%",
                }}
                px="2"
                pr="4"
            >
                <div className={headerContent}>
                    <Link
                        to={HOMEPAGE}
                        className={logoLink}
                        aria-label="Go to homepage"
                        style={{ color: "unset" }}
                    >
                        <Logo size={48} color={logoColor} />
                        <Text size="5" weight="medium">
                            GW2 Tools
                        </Text>
                    </Link>
                    <div className={rightOptions}>
                        <Button
                            onClick={toggleMode}
                            aria-label="Toggle theme"
                            variant="ghost"
                        >
                            {mode === "light" ? <SunIcon /> : <MoonIcon />}
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

const PageContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={pageContent} id="page-content">
            {children}
        </div>
    );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={layoutWrapper}>
            <Header />
            <PageContent>{children}</PageContent>
        </div>
    );
};

export default Layout;
