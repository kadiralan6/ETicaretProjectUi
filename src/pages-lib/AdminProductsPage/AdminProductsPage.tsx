"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import { FiSettings, FiPlus, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import type { IAdminProductListItem } from "@/interfaces/IProduct";

export const AdminProductsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    code: "",
    name: "",
    isActive: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, filters],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.PRODUCTS, {
        params: {
          Page: page,
          PageSize: 10,
          Name: filters.name || undefined,
          Code: filters.code || undefined,
          IsActive:
            filters.isActive === ""
              ? undefined
              : filters.isActive === "true",
          MinPrice: filters.minPrice || undefined,
          MaxPrice: filters.maxPrice || undefined,
          OrderBy: 0,
          OrderType: 0,
        },
      });
      return res.data?.data;
    },
  });

  const products: IAdminProductListItem[] = data?.results ?? [];
  const pageCount: number = data?.pageCount ?? 1;
  const rowCount: number = data?.rowCount ?? 0;

  const handleFilterChange = (
    field: keyof typeof filters,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleDelete = async (product: IAdminProductListItem) => {
    const confirmed = window.confirm(
      `"${product.name}" ${t("product.deleteConfirm")}`,
    );
    if (!confirmed) return;

    try {
      await nextApiClient.delete(NEXT_API_URLS.PRODUCT_BY_ID(product.id));
      toast.success(t("product.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(message || t("product.deleteError"));
    }
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
        <Heading size="lg">{t("product.list")}</Heading>
        <Link href={ROUTES.ADMIN_PRODUCT_CREATE} passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml="8px">{t("product.create")}</Text>
          </Button>
        </Link>
      </Flex>

      {/* Filters */}
      <Flex mb="16px" gap="12px" wrap="wrap">
        <Input
          placeholder={t("product.searchByName")}
          maxW="240px"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <Input
          placeholder={t("product.searchByCode")}
          maxW="220px"
          value={filters.code}
          onChange={(e) => handleFilterChange("code", e.target.value)}
        />
        <Input
          type="number"
          placeholder={t("product.minPrice")}
          maxW="140px"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
        />
        <Input
          type="number"
          placeholder={t("product.maxPrice")}
          maxW="140px"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
        />
        <select
          style={{
            height: "40px",
            padding: "0 12px",
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            background: "transparent",
            minWidth: "140px",
          }}
          value={filters.isActive}
          onChange={(e) => handleFilterChange("isActive", e.target.value)}
        >
          <option value="">{t("common.allStatuses")}</option>
          <option value="true">{t("common.active")}</option>
          <option value="false">{t("common.passive")}</option>
        </select>
      </Flex>

      <Box overflowX="auto" position="relative" minH="200px">
        {isFetching && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bg="whiteAlpha.700"
            _dark={{ bg: "blackAlpha.600" }}
            zIndex={10}
            justify="center"
            align="center"
          >
            <Spinner size="lg" color="purple.500" />
          </Flex>
        )}

        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">
                {t("common.actions")}
              </Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.code")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.name")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.brand")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.category")}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                {t("common.status")}
              </Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.stock")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("product.price")}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.length > 0 ? (
              products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell
                    textAlign="center"
                    position="relative"
                    overflow="visible"
                  >
                    <Menu.Root positioning={{ placement: "bottom-start" }}>
                      <Menu.Trigger asChild>
                        <IconButton
                          aria-label={t("common.actions")}
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
                            value="view"
                            asChild
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                            borderRadius="sm"
                          >
                            <Link
                              href={ROUTES.ADMIN_PRODUCT_EDIT(
                                String(product.id),
                              )}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                textDecoration: "none",
                              }}
                            >
                              <FiSettings
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
                                {t("common.detail")}
                              </Text>
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            value="delete"
                            px={3}
                            py={2}
                            cursor="pointer"
                            onClick={() => handleDelete(product)}
                            _hover={{ bg: "red.50" }}
                            _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                            borderRadius="sm"
                          >
                            <Flex align="center" w="full">
                              <FiTrash2
                                style={{ marginRight: "8px" }}
                                color="red"
                              />
                              <Text
                                whiteSpace="nowrap"
                                fontSize="sm"
                                fontWeight="medium"
                                color="red.500"
                              >
                                {t("common.delete")}
                              </Text>
                            </Flex>
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Table.Cell>
                  <Table.Cell fontWeight="medium">{product.code}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.brandName}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette="purple">{product.categoryName}</Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge
                      colorPalette={product.isActive ? "green" : "red"}
                    >
                      {product.isActive
                        ? t("common.active")
                        : t("common.passive")}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    <Text
                      color={
                        product.stockQuantity < 2 ? "red.500" : "green.500"
                      }
                      fontWeight="bold"
                    >
                      {product.stockQuantity}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="left" fontWeight="semibold">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              !isFetching && (
                <Table.Row>
                  <Table.Cell
                    colSpan={8}
                    textAlign="center"
                    py="40px"
                    color="gray.500"
                  >
                    {t("common.noRecords")}
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="space-between" align="center" mt="16px">
        <Text fontSize="sm" color="gray.500">
          Sayfa {page} / {pageCount} • Toplam {rowCount} kayıt
        </Text>
        <Flex gap="8px">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {t("common.previous")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => setPage((prev) => prev + 1)}
          >
            {t("common.next")}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
