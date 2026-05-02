"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Box, Button, Container, Heading, Stack, Text, SimpleGrid } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

import { ControlledInput } from "@/components/form/ControlledInput/ControlledInput";
import { useTranslation } from "@/providers/TranslationProvider";
import { registerSchema, type RegisterSchemaType } from "@/validations/registerSchema";

export const RegisterPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema = registerSchema(t);

  const { control, handleSubmit } = useForm<RegisterSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const response = await axios.post(
        `${backendUrl}/api/identity/auth/register`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userName: data.userName,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      );

      const body = response.data;

      // Backend başarılı döndü — direkt login yap
      if (body?.isSuccess) {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          // Kayıt başarılı ama otomatik login olmadı — login sayfasına yönlendir
          router.push(`/${lang}/login`);
        } else {
          router.push(`/${lang}`);
          router.refresh();
        }
      } else {
        const errMsg = body?.errors?.[0] ?? t("auth.genericError");
        setError(errMsg);
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.errors?.[0] ?? t("auth.genericError");
      // E-posta zaten kayıtlı hatası
      if (err?.response?.status === 400) {
        setError(errMsg || t("auth.emailAlreadyUsed"));
      } else {
        setError(t("auth.genericError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="sm" py="80px">
      <Stack gap="32px" align="center">
        <Stack gap="8px" align="center">
          <Heading>{t("auth.register")}</Heading>
          <Text color="fg.muted" fontSize="sm">
            {t("auth.hasAccount")}{" "}
            <Link
              href={`/${lang}/login`}
              style={{ color: "var(--chakra-colors-teal-600)", fontWeight: 600 }}
            >
              {t("auth.login")}
            </Link>
          </Text>
        </Stack>

        <Box
          w="full"
          bg="white"
          p="32px"
          shadow="md"
          borderRadius="lg"
          _dark={{ bg: "gray.800" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="20px">
              <SimpleGrid columns={2} gap="16px">
                <ControlledInput
                  control={control}
                  name="firstName"
                  label={t("auth.firstName")}
                  placeholder={t("auth.firstNamePlaceholder")}
                />
                <ControlledInput
                  control={control}
                  name="lastName"
                  label={t("auth.lastName")}
                  placeholder={t("auth.lastNamePlaceholder")}
                />
              </SimpleGrid>

              <ControlledInput
                control={control}
                name="email"
                label={t("auth.email")}
                type="email"
                placeholder={t("auth.emailPlaceholder")}
              />

              <ControlledInput
                control={control}
                name="userName"
                label={t("auth.userName")}
                placeholder={t("auth.userNamePlaceholder")}
              />

              <ControlledInput
                control={control}
                name="password"
                label={t("auth.password")}
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
              />

              <ControlledInput
                control={control}
                name="confirmPassword"
                label={t("auth.confirmPassword")}
                type="password"
                placeholder={t("auth.confirmPasswordPlaceholder")}
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
                loadingText={t("auth.registering")}
              >
                {t("auth.register")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};
