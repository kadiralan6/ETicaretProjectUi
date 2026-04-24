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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiSave } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import type { IBrand } from "@/interfaces/IBrand";

const generateSlug = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ı/g, "i")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

interface Props {
  params: Promise<{ id: string }>;
}

export const AdminBrandUpdatePage = ({ params }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    slug: "",
    isActive: true,
  });

  const { isLoading } = useQuery<IBrand>({
    queryKey: QUERY_KEYS.BRAND_DETAIL(id),
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.BRAND_BY_ID(id));
      const brand = res.data?.data || res.data;
      setFormData({
        id: brand.id || id,
        name: brand.name || "",
        description: brand.description || "",
        slug: brand.slug || "",
        isActive: brand.isActive !== undefined ? brand.isActive : true,
      });
      return brand;
    },
    enabled: !!id,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: generateSlug(newName),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, id: Number(id) };
      await nextApiClient.put(NEXT_API_URLS.BRAND_BY_ID(id), payload);
      toast.success(t("brand.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BRAND_DETAIL(id) });
      router.push(ROUTES.ADMIN_BRANDS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("brand.updateError"));
    } finally {
      setLoading(false);
    }
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
        {t("brand.update")}
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("brand.name")}
            </Text>
            <Input
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder={t("brand.namePlaceholder")}
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("common.slug")}
            </Text>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              readOnly
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              cursor="not-allowed"
            />
            <Text fontSize="xs" color="gray.500">
              {t("brand.slugReadonly")}
            </Text>
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("common.status")}
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
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true",
                }))
              }
            >
              <option value="true">{t("common.active")}</option>
              <option value="false">{t("common.passive")}</option>
            </select>
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                {t("common.description")}
              </Text>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Marka hakkında kısa bir açıklama..."
                rows={4}
              />
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_BRANDS)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            colorPalette="purple"
            type="submit"
            loading={loading as unknown as boolean}
          >
            <FiSave />
            <Text ml="8px">{t("common.update")}</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
