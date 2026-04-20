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
import type { IBrand } from "@/interfaces/IBrand";

export const AdminBrandsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS, page, search],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.BRANDS_GET_ALL, {
        params: {
          Page: page,
          PageSize: 10,
          Search: search || undefined,
        },
      });
      return res.data?.data;
    },
  });

  const brands: IBrand[] = data?.results ?? [];
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
        <Heading size="lg">{t("brand.list")}</Heading>
        <Link href={ROUTES.ADMIN_BRAND_CREATE} passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml="8px">{t("brand.create")}</Text>
          </Button>
        </Link>
      </Flex>

      <Flex mb="16px">
        <Input
          placeholder={t("brand.searchPlaceholder")}
          maxW="300px"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              <Table.ColumnHeader>{t("brand.name")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("common.slug")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("common.description")}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                {t("common.status")}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {brands?.length > 0 ? (
              brands.map((p) => (
                <Table.Row key={p.id}>
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
                              href={ROUTES.ADMIN_BRAND_EDIT(String(p.id))}
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
                  <Table.Cell fontWeight="medium">{p.name}</Table.Cell>
                  <Table.Cell color="gray.500">{p.slug}</Table.Cell>
                  <Table.Cell>
                    {p.description?.substring(0, 50)}
                    {(p.description?.length ?? 0) > 50 ? "..." : ""}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge
                      colorPalette={p.isActive === false ? "red" : "green"}
                    >
                      {p.isActive === false
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
