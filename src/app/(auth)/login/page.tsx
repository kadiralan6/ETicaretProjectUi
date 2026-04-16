"use client"

import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { loginSchema, type LoginFormValues } from "@/validations/loginValidation"
import { ControlledInput } from "@/components/form/ControlledInput"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Geçersiz e-posta veya şifre")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="sm" py={20}>
      <Stack gap={8} align="center">
        <Heading>Giriş Yap</Heading>
        <Box w="full" bg="white" p={8} shadow="md" borderRadius="lg" _dark={{ bg: "gray.800" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={6}>
              <ControlledInput
                control={control}
                name="email"
                label="E-posta"
                type="email"
                placeholder="ornek@email.com"
              />
              <ControlledInput
                control={control}
                name="password"
                label="Şifre"
                type="password"
                placeholder="******"
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
                loadingText="Giriş yapılıyor..."
              >
                Giriş Yap
              </Button>

              {/* Mock kullanıcı bilgileri — geliştirme döneminde */}
              <Box bg="gray.50" p={4} borderRadius="md" _dark={{ bg: "gray.700" }}>
                <Text fontSize="xs" color="gray.500" mb={2} fontWeight="bold">
                  Test Hesapları:
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Admin: admin@test.com / 123456
                </Text>
                <Text fontSize="xs" color="gray.500">
                  User: user@test.com / 123456
                </Text>
              </Box>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  )
}
