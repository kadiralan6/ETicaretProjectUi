"use client";

import { useState } from "react";
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
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiMoreVertical, FiTrash2, FiSettings } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import type { IAdminCategory } from "@/interfaces/ICategory";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("");

  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, page, search, isActive],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CATEGORIES_ALL_FILTER, {
        params: {
          Page: page,
          PageSize: 10,
          Search: search || undefined,
          IsActive: isActive === "" ? undefined : isActive === "true",
          OrderBy: 0,
          OrderType: 0,
        },
      });
      return res.data?.data;
    },
  });

  const categories: IAdminCategory[] = data?.results ?? [];
  const pageCount: number = data?.pageCount ?? 1;
  const rowCount: number = data?.rowCount ?? 0;

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="24px"
      borderRadius="xl"
      shadow="sm"
    >
      <Flex justify="space-between" align="center" mb="24px">
        <Heading size="lg">{t("category.list")}</Heading>
        <Link href={ROUTES.ADMIN_CATEGORY_CREATE} passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml="8px">{t("category.create")}</Text>
          </Button>
        </Link>
      </Flex>

      {/* Filters */}
      <Flex mb="16px" gap="12px" wrap="wrap">
        <Input
          placeholder={t("category.searchPlaceholder")}
          maxW="300px"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
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
              <Table.ColumnHeader>{t("category.name")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("category.parentCategory")}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                {t("category.displayOrder")}
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                {t("common.status")}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories?.length > 0 ? (
              categories.map((c) => (
                <Table.Row key={c.id}>
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
                              href={ROUTES.ADMIN_CATEGORY_EDIT(String(c.id))}
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
                  <Table.Cell fontWeight="medium">{c.name}</Table.Cell>
                  <Table.Cell color="gray.500">
                    {c.parentCategoryName ?? "—"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{c.displayOrder}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge
                      colorPalette={c.isActive === false ? "red" : "green"}
                    >
                      {c.isActive === false
                        ? t("common.passive")
                        : t("common.active")}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              !isFetching && (
                <Table.Row>
                  <Table.Cell
                    colSpan={5}
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
          Sayfa {page} / {pageCount} &bull; Toplam {rowCount} kayıt
        </Text>
        <Flex gap="8px">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t("common.previous")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("common.next")}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
