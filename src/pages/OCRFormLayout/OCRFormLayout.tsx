import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Section,
    TextField,
} from "@radix-ui/themes";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import GoogleDocumentProcessor from "@/pages/OCRFormLayout/Processors/GoogleDocumentProcessor";
import AWSDocumentProcessor from "@/pages/OCRFormLayout/Processors/AWSDocumentProcessor";
import { usePassword } from "@/contexts/PasswordContext";

function OCRFormLayout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { password, setPassword, hasError, setHasError } = usePassword();

    const processor = {
        "/google": <GoogleDocumentProcessor />,
        "/aws": <AWSDocumentProcessor />,
    }[pathname];

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
        setHasError(false);
    };

    return (
        <Box>
            <Container size="2" align="center">
                <Section mx="4">
                    <Grid gap="4">
                        <Flex gap="3" justify="between">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                            >
                                <ArrowLeftIcon aria-hidden="true" /> Back
                            </Button>
                            <TextField.Root
                                size="1"
                                placeholder="Enter password..."
                                value={password}
                                onChange={handlePasswordChange}
                                type="password"
                                style={{ maxWidth: "200px", width: "100%" }}
                                color={hasError ? "red" : undefined}
                                variant={hasError ? "soft" : undefined}
                            />
                        </Flex>
                        {processor}
                    </Grid>
                </Section>
            </Container>
        </Box>
    );
}

export default OCRFormLayout;
