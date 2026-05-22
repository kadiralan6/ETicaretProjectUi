"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  Table,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiMoreVertical, FiEye, FiEdit2 } from "react-icons/fi";

import { ROUTES } from "@/constants/routes";
import type { ICustomer } from "@/interfaces/ICustomer";

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

const PAGE_SIZE = 5;

export const AdminCustomersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return MOCK_CUSTOMERS;
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("tr-TR");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="24px"
      borderRadius="xl"
      shadow="sm"
    >
      <Flex justify="space-between" align="center" mb="24px">
        <Heading size="lg">Müşteriler</Heading>
        <Link href={ROUTES.ADMIN_CUSTOMER_CREATE} passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml="8px">Yeni Müşteri</Text>
          </Button>
        </Link>
      </Flex>

      <Flex mb="16px">
        <Input
          placeholder="Ad, soyad, e-posta veya telefon ara..."
          maxW="340px"
          value={search}
          onChange={handleSearchChange}
        />
      </Flex>

      <Box overflowX="auto">
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">
                İşlem
              </Table.ColumnHeader>
              <Table.ColumnHeader>Ad Soyad</Table.ColumnHeader>
              <Table.ColumnHeader>E-posta</Table.ColumnHeader>
              <Table.ColumnHeader>Telefon</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Rol</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Sipariş
              </Table.ColumnHeader>
              <Table.ColumnHeader>Kayıt Tarihi</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginated.length > 0 ? (
              paginated.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell
                    textAlign="center"
                    position="relative"
                    overflow="visible"
                  >
                    <Menu.Root positioning={{ placement: "bottom-start" }}>
                      <Menu.Trigger asChild>
                        <IconButton
                          aria-label="İşlemler"
                          variant="ghost"
                          size="sm"
                          color="gray.500"
                        >
                          <FiMoreVertical />
                        </IconButton>
                      </Menu.Trigger>
                      <Menu.Positioner
                        style={{ position: "absolute", zIndex: 20 }}
                      >
                        <Menu.Content
                          position="absolute"
                          top="100%"
                          mt={1}
                          minW="160px"
                          bg="white"
                          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                          boxShadow="xl"
                          border="1px solid"
                          borderColor="gray.100"
                          borderRadius="md"
                          p={1}
                          zIndex={20}
                        >
                          <Menu.Item
                            value="detail"
                            asChild
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                            borderRadius="sm"
                          >
                            <Link
                              href={ROUTES.ADMIN_CUSTOMER_DETAIL(c.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                textDecoration: "none",
                              }}
                            >
                              <FiEye
                                style={{ marginRight: "8px" }}
                                color="gray"
                              />
                              <Text
                                whiteSpace="nowrap"
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.700"
                                _dark={{ color: "gray.200" }}
                              >
                                Detay
                              </Text>
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            value="edit"
                            asChild
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                            borderRadius="sm"
                          >
                            <Link
                              href={ROUTES.ADMIN_CUSTOMER_DETAIL(c.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                textDecoration: "none",
                              }}
                            >
                              <FiEdit2
                                style={{ marginRight: "8px" }}
                                color="gray"
                              />
                              <Text
                                whiteSpace="nowrap"
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.700"
                                _dark={{ color: "gray.200" }}
                              >
                                Düzenle
                              </Text>
                            </Link>
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Table.Cell>
                  <Table.Cell fontWeight="medium">
                    {c.firstName} {c.lastName}
                  </Table.Cell>
                  <Table.Cell color="gray.600" _dark={{ color: "gray.300" }}>
                    {c.email}
                  </Table.Cell>
                  <Table.Cell>{c.phone}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge
                      colorPalette={c.role === "Admin" ? "purple" : "blue"}
                      size="sm"
                    >
                      {c.role === "Admin" ? "Admin" : "Müşteri"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="center">{c.orderCount}</Table.Cell>
                  <Table.Cell>{formatDate(c.createdAt)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge colorPalette={c.isActive ? "green" : "red"}>
                      {c.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan={8}
                  textAlign="center"
                  py="40px"
                  color="gray.500"
                >
                  Kayıt bulunamadı
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="space-between" align="center" mt="16px">
        <Text fontSize="sm" color="gray.500">
          Sayfa {page} / {pageCount} &bull; Toplam {filtered.length} kayıt
        </Text>
        <Flex gap="8px">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Önceki
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Sonraki
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
