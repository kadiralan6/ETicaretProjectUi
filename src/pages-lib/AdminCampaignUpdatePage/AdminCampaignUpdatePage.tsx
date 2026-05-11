"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiSave } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { CampaignTypeCommonEnum } from "@/interfaces/ICampaign";
import type {
  CampaignTypeCommon,
  ICampaign,
  IUpdateCampaignRequest,
} from "@/interfaces/ICampaign";

const toLocalDatetime = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface Props {
  params: Promise<{ id: string }>;
}

export const AdminCampaignUpdatePage = ({ params }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [formData, setFormData] = useState({
    name: "",
    type: CampaignTypeCommonEnum.Percentage as CampaignTypeCommon,
    discountValue: 0,
    minimumOrderAmount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    isActive: true,
  });

  const { isLoading } = useQuery<ICampaign>({
    queryKey: QUERY_KEYS.CAMPAIGN_DETAIL(id),
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CAMPAIGN_BY_ID(id));
      const c: ICampaign = res.data?.data || res.data;
      setFormData({
        name: c.name ?? "",
        type: c.type ?? CampaignTypeCommonEnum.Percentage,
        discountValue: c.discountValue ?? 0,
        minimumOrderAmount: c.minimumOrderAmount ?? 0,
        startDate: toLocalDatetime(c.startDate),
        endDate: toLocalDatetime(c.endDate),
        usageLimit: c.usageLimit ?? 0,
        isActive: c.isActive ?? true,
      });
      return c;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: IUpdateCampaignRequest) => {
      const res = await nextApiClient.put(
        NEXT_API_URLS.CAMPAIGN_BY_ID(id),
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Kampanya güncellendi");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CAMPAIGN_DETAIL(id),
      });
      router.push(ROUTES.ADMIN_CAMPAIGNS);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Güncelleme başarısız");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: IUpdateCampaignRequest = {
      id: Number(id),
      name: formData.name,
      type: formData.type,
      discountValue: Number(formData.discountValue),
      minimumOrderAmount: Number(formData.minimumOrderAmount),
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : "",
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : "",
      usageLimit: Number(formData.usageLimit),
      isActive: formData.isActive,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="64">
        <Spinner size="xl" color="purple.500" />
      </Flex>
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
      <Heading size="lg" mb="24px">
        Kampanya Düzenle
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                Ad <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
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
              Durum
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
              value={formData.isActive.toString()}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  isActive: e.target.value === "true",
                }))
              }
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
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
                  discountValue: Number(e.target.value),
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
                  minimumOrderAmount: Number(e.target.value),
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
                  usageLimit: Number(e.target.value),
                }))
              }
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Başlangıç Tarihi <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, startDate: e.target.value }))
              }
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              Bitiş Tarihi <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, endDate: e.target.value }))
              }
              required
            />
          </VStack>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_CAMPAIGNS)}
          >
            İptal
          </Button>
          <Button
            colorPalette="purple"
            type="submit"
            loading={updateMutation.isPending}
          >
            <FiSave />
            <Text ml="8px">Güncelle</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
