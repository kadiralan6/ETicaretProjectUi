"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import type { ICreateCustomerRequest } from "@/interfaces/ICustomer";

export const AdminCustomerCreatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<ICreateCustomerRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "Customer",
  });

  const handleChange =
    (field: keyof ICreateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock kayıt işlemi
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Müşteri oluşturuldu");
      router.push(ROUTES.ADMIN_CUSTOMERS);
    }, 800);
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="32px"
      borderRadius="xl"
      shadow="sm"
      maxW="4xl"
    >
      <Heading size="lg" mb="24px">
        Yeni Müşteri
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Ad <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              value={formData.firstName}
              onChange={handleChange("firstName")}
              placeholder="Ahmet"
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Soyad <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              value={formData.lastName}
              onChange={handleChange("lastName")}
              placeholder="Yılmaz"
              required
            />
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                E-posta <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="ahmet@example.com"
                required
              />
            </VStack>
          </GridItem>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Telefon
            </Text>
            <Input
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              placeholder="+90 532 000 0000"
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Rol
            </Text>
            <select
              style={{
                height: "40px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "transparent",
                width: "100%",
              }}
              value={formData.role}
              onChange={handleChange("role")}
            >
              <option value="Customer">Müşteri</option>
              <option value="Admin">Admin</option>
            </select>
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                Şifre <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_CUSTOMERS)}
          >
            İptal
          </Button>
          <Button colorPalette="purple" type="submit" loading={isLoading}>
            <FiSave />
            <Text ml="8px">Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
