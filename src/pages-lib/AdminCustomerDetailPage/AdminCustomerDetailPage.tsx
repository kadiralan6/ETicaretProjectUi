"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
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
import { FiSave, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import type { ICustomer, IUpdateCustomerRequest } from "@/interfaces/ICustomer";

const MOCK_CUSTOMERS: ICustomer[] = [
  {
    id: "1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 532 111 2233",
    role: "Customer",
    orderCount: 8,
    isActive: true,
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "2",
    firstName: "Fatma",
    lastName: "Kaya",
    email: "fatma.kaya@example.com",
    phone: "+90 541 222 3344",
    role: "Customer",
    orderCount: 3,
    isActive: true,
    createdAt: "2024-02-14T10:30:00Z",
  },
  {
    id: "3",
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@example.com",
    phone: "+90 505 333 4455",
    role: "Customer",
    orderCount: 12,
    isActive: false,
    createdAt: "2024-03-05T14:00:00Z",
  },
  {
    id: "4",
    firstName: "Zeynep",
    lastName: "Çelik",
    email: "zeynep.celik@example.com",
    phone: "+90 553 444 5566",
    role: "Customer",
    orderCount: 1,
    isActive: true,
    createdAt: "2024-04-20T09:15:00Z",
  },
  {
    id: "5",
    firstName: "Ali",
    lastName: "Şahin",
    email: "ali.sahin@example.com",
    phone: "+90 544 555 6677",
    role: "Admin",
    orderCount: 0,
    isActive: true,
    createdAt: "2024-05-01T11:00:00Z",
  },
  {
    id: "6",
    firstName: "Ayşe",
    lastName: "Arslan",
    email: "ayse.arslan@example.com",
    phone: "+90 512 666 7788",
    role: "Customer",
    orderCount: 6,
    isActive: true,
    createdAt: "2024-06-12T16:45:00Z",
  },
  {
    id: "7",
    firstName: "Mustafa",
    lastName: "Öztürk",
    email: "mustafa.ozturk@example.com",
    phone: "+90 538 777 8899",
    role: "Customer",
    orderCount: 4,
    isActive: false,
    createdAt: "2024-07-03T13:00:00Z",
  },
  {
    id: "8",
    firstName: "Elif",
    lastName: "Doğan",
    email: "elif.dogan@example.com",
    phone: "+90 561 888 9900",
    role: "Customer",
    orderCount: 9,
    isActive: true,
    createdAt: "2024-08-22T07:30:00Z",
  },
];

interface Props {
  customerId: string;
}

export const AdminCustomerDetailPage = ({ customerId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);

  const [formData, setFormData] = useState<IUpdateCustomerRequest>({
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    phone: customer?.phone ?? "",
    role: customer?.role ?? "Customer",
    isActive: customer?.isActive ?? true,
  });

  const handleChange =
    (field: keyof IUpdateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "isActive" ? e.target.value === "true" : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Müşteri güncellendi");
      router.push(ROUTES.ADMIN_CUSTOMERS);
    }, 800);
  };

  if (!customer) {
    return (
      <Box
        bg="white"
        _dark={{ bg: "gray.800" }}
        p="32px"
        borderRadius="xl"
        shadow="sm"
      >
        <Text color="gray.500">Müşteri bulunamadı.</Text>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="32px"
      borderRadius="xl"
      shadow="sm"
      maxW="4xl"
    >
      <Flex align="center" gap="12px" mb="24px">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(ROUTES.ADMIN_CUSTOMERS)}
          px={2}
        >
          <FiArrowLeft />
        </Button>
        <Heading size="lg">Müşteri Detayı</Heading>
        <Badge
          colorPalette={customer.isActive ? "green" : "red"}
          ml="auto"
        >
          {customer.isActive ? "Aktif" : "Pasif"}
        </Badge>
      </Flex>

      <Box
        mb="24px"
        p="16px"
        borderRadius="lg"
        bg="gray.50"
        _dark={{ bg: "gray.700" }}
      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="16px">
          <VStack align="start" gap="2px">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
              E-posta
            </Text>
            <Text fontWeight="medium">{customer.email}</Text>
          </VStack>
          <VStack align="start" gap="2px">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
              Sipariş Sayısı
            </Text>
            <Text fontWeight="medium">{customer.orderCount}</Text>
          </VStack>
          <VStack align="start" gap="2px">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
              Kayıt Tarihi
            </Text>
            <Text fontWeight="medium">
              {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
            </Text>
          </VStack>
        </Grid>
      </Box>

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
              required
            />
          </VStack>

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
                Durum
              </Text>
              <select
                style={{
                  height: "40px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                  background: "transparent",
                  width: "200px",
                }}
                value={String(formData.isActive)}
                onChange={handleChange("isActive")}
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
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
