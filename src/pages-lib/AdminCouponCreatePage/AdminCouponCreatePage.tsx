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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { CampaignTypeCommonEnum } from "@/interfaces/ICampaign";
import type { CampaignTypeCommon } from "@/interfaces/ICampaign";
import type { ICreateCouponRequest } from "@/interfaces/ICoupon";

export const AdminCouponCreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    code: "",
    type: CampaignTypeCommonEnum.Percentage as CampaignTypeCommon,
    discountValue: "",
    minimumOrderAmount: "",
    expirationDate: "",
    usageLimit: "",
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ICreateCouponRequest) => {
      const res = await nextApiClient.post(NEXT_API_URLS.COUPONS_CREATE, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Kupon oluşturuldu");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPONS] });
      router.push(ROUTES.ADMIN_COUPONS);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Oluşturma başarısız");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ICreateCouponRequest = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      discountValue: Number(formData.discountValue),
      minimumOrderAmount: Number(formData.minimumOrderAmount),
      expirationDate: formData.expirationDate
        ? new Date(formData.expirationDate).toISOString()
        : "",
      usageLimit: Number(formData.usageLimit),
    };
    createMutation.mutate(payload);
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
        Yeni Kupon
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                Kupon Kodu <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="WELCOME10"
                fontFamily="mono"
                required
              />
            </VStack>
          </GridItem>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Tip
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
              value={formData.type}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  type: Number(e.target.value) as CampaignTypeCommon,
                }))
              }
            >
              <option value={CampaignTypeCommonEnum.Percentage}>Yüzde</option>
              <option value={CampaignTypeCommonEnum.FixedAmount}>
                Sabit Tutar
              </option>
            </select>
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              İndirim Değeri <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="number"
              min={0}
              value={formData.discountValue}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  discountValue: e.target.value,
                }))
              }
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Minimum Sipariş Tutarı
            </Text>
            <Input
              type="number"
              min={0}
              value={formData.minimumOrderAmount}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  minimumOrderAmount: e.target.value,
                }))
              }
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Kullanım Limiti
            </Text>
            <Input
              type="number"
              min={0}
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  usageLimit: e.target.value,
                }))
              }
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Son Kullanım Tarihi <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="datetime-local"
              value={formData.expirationDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, expirationDate: e.target.value }))
              }
              required
            />
          </VStack>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_COUPONS)}
          >
            İptal
          </Button>
          <Button
            colorPalette="purple"
            type="submit"
            loading={createMutation.isPending}
          >
            <FiSave />
            <Text ml="8px">Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
