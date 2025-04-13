import { useMemo } from "react";
import { Link } from "react-router-dom";

import { APP_VERSION, GITHUB_URL, HOMEPAGE } from "@/utils/constants";
import Logo from "@/components/Logo/Logo";
import {
    attribution,
    footer,
    githubLogo,
    header,
    headerContent,
    layoutWrapper,
    logoLink,
    pageContent,
    rightOptions,
    versionText,
} from "@/components/Layout/Layout.css";
import { Button, Container, Flex, Text } from "@radix-ui/themes";
import { useTheme } from "@/utils/useTheme";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import HeartIcon from "@/components/HeartIcon/HeartIcon";

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

const Footer = () => {
    return (
        <div className={footer}>
            <Container
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    height: "100%",
                }}
                px="2"
            >
                <Flex align="center" justify="between">
                    <div className={versionText}>{APP_VERSION}</div>
                    <div className={attribution}>
                        Made with&nbsp;
                        <HeartIcon
                            style={{
                                fontSize: "0.875em",
                            }}
                        />
                        &nbsp;by Woods to Eternity.9851
                    </div>
                    <div className={githubLogo}>
                        <Link
                            to={GITHUB_URL}
                            aria-label="Visit GitHub repository"
                            style={{
                                color: "unset",
                                display: "flex",
                                alignItems: "center",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                aria-label="Visit GitHub repository"
                                variant="ghost"
                            >
                                <GitHubLogoIcon width="12" height="12" />
                            </Button>
                        </Link>
                    </div>
                </Flex>
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
            <Footer />
        </div>
    );
};

export default Layout;
