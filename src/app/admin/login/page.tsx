"use client"

import { Box, Button, Container, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FiLock } from "react-icons/fi"

export default function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate Login Request
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 1000)
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: "gray.900" }} p={4}>
      <Container maxW="md">
        <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="2xl" shadow="xl" borderTop="4px solid" borderColor="purple.500">
          <VStack gap={6} align="stretch">
            <VStack gap={2}>
              <Box p={3} bg="purple.100" color="purple.600" borderRadius="full" mb={2}>
                <FiLock size={28} />
              </Box>
              <Heading size="xl">Admin Girişi</Heading>
              <Text color="gray.500" fontSize="sm">Yönetim paneline erişmek için oturum açın.</Text>
            </VStack>
            
            <form onSubmit={handleLogin}>
              <VStack gap={4}>
                <Input 
                  placeholder="Kullanıcı Adı veya E-posta" 
                  size="lg" 
                  variant="outline"
                  required
                />
                <Input 
                  placeholder="Şifre" 
                  type="password" 
                  size="lg" 
                  variant="outline"
                  required
                />
                <Button 
                  type="submit" 
                  colorPalette="purple" 
                  size="lg" 
                  w="full" 
                  loading={loading}
                >
                  Giriş Yap
                </Button>
              </VStack>
            </form>
            
            <Text textAlign="center" fontSize="xs" color="gray.400">
              Sadece yetkili personel erişebilir.
            </Text>
          </VStack>
        </Box>
      </Container>
    </Flex>
  )
}
