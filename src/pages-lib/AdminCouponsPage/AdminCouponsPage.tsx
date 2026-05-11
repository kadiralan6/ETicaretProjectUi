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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { CampaignTypeCommonEnum, OrderTypeEnum } from "@/interfaces/ICampaign";
import { CouponOrderByEnum } from "@/interfaces/ICoupon";
import type { ICoupon } from "@/interfaces/ICoupon";

export const AdminCouponsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.COUPONS, page, search],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.COUPONS_GET_ALL_FILTER, {
        params: {
          page,
          pageSize: 10,
          orderBy: CouponOrderByEnum.CreatedAt,
          orderType: OrderTypeEnum.DESC,
          search: search || undefined,
        },
      });
      return res.data?.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await nextApiClient.delete(NEXT_API_URLS.COUPON_BY_ID(id));
    },
    onSuccess: () => {
      toast.success("Kupon silindi");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPONS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Silme işlemi başarısız");
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    deleteMutation.mutate(id);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("tr-TR");
  };

  const coupons: ICoupon[] = data?.results ?? [];
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
        <Heading size="lg">Kuponlar</Heading>
        <Link href={ROUTES.ADMIN_COUPON_CREATE} passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml="8px">Yeni Kupon</Text>
          </Button>
        </Link>
      </Flex>

      <Flex mb="16px">
        <Input
          placeholder="Kupon kodu ara..."
          maxW="300px"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
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
                İşlem
              </Table.ColumnHeader>
              <Table.ColumnHeader>Kod</Table.ColumnHeader>
              <Table.ColumnHeader>Tip</Table.ColumnHeader>
              <Table.ColumnHeader>İndirim</Table.ColumnHeader>
              <Table.ColumnHeader>Min. Tutar</Table.ColumnHeader>
              <Table.ColumnHeader>Son Kullanım</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Kullanım</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {coupons?.length > 0 ? (
              coupons.map((c) => (
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
                              href={ROUTES.ADMIN_COUPON_EDIT(c.id)}
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
                                Düzenle
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
                            onClick={() => handleDelete(c.id)}
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
                                Sil
                              </Text>
                            </Flex>
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Table.Cell>
                  <Table.Cell fontWeight="medium" fontFamily="mono">
                    {c.code}
                  </Table.Cell>
                  <Table.Cell>
                    {c.type === CampaignTypeCommonEnum.Percentage
                      ? "Yüzde"
                      : "Sabit Tutar"}
                  </Table.Cell>
                  <Table.Cell>
                    {c.type === CampaignTypeCommonEnum.Percentage
                      ? `%${c.discountValue}`
                      : `${c.discountValue} ₺`}
                  </Table.Cell>
                  <Table.Cell>{c.minimumOrderAmount} ₺</Table.Cell>
                  <Table.Cell>{formatDate(c.expirationDate)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {c.usageCount}/{c.usageLimit}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge colorPalette={c.isActive ? "green" : "red"}>
                      {c.isActive ? "Aktif" : "Pasif"}
                    </Badge>
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
                    Kayıt bulunamadı
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
