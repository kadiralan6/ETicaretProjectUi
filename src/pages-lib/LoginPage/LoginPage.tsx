"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { ControlledInput } from "@/components/form/ControlledInput/ControlledInput";
import { useTranslation } from "@/providers/TranslationProvider";
import { loginSchema, type LoginSchemaType } from "@/validations/loginSchema";

export const LoginPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema = loginSchema(t);

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.invalidCredentials"));
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(t("auth.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="sm" py="80px">
      <Stack gap="32px" align="center">
        <Heading>{t("auth.login")}</Heading>
        <Box
          w="full"
          bg="white"
          p="32px"
          shadow="md"
          borderRadius="lg"
          _dark={{ bg: "gray.800" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="24px">
              <ControlledInput
                control={control}
                name="email"
                label={t("auth.email")}
                type="email"
                placeholder={t("auth.emailPlaceholder")}
              />
              <ControlledInput
                control={control}
                name="password"
                label={t("auth.password")}
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
              />

              {error && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              )}

              <Button
                type="submit"
                colorPalette="teal"
                width="full"
                size="lg"
                loading={isLoading}
                loadingText={t("auth.loggingIn")}
              >
                {t("auth.login")}
              </Button>

              {/* Mock kullanıcı bilgileri — geliştirme döneminde */}
              <Box
                bg="gray.50"
                p="16px"
                borderRadius="md"
                _dark={{ bg: "gray.700" }}
              >
                <Text fontSize="xs" color="gray.500" mb="8px" fontWeight="bold">
                  {t("auth.testAccounts")}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {t("auth.adminAccount")}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {t("auth.userAccount")}
                </Text>
              </Box>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};
