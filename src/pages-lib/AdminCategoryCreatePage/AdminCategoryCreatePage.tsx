"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import type { IAdminCategory } from "@/interfaces/ICategory";

export const AdminCategoryCreatePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    parentCategoryId: "" as string | number,
    displayOrder: 0,
  });

  const { data: parentCategoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, "parent-list"],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CATEGORIES_ALL_FILTER, {
        params: { Page: 1, PageSize: 100 },
      });
      return res.data?.data?.results ?? [];
    },
  });

  const parentCategories: IAdminCategory[] = parentCategoriesData ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        parentCategoryId:
          formData.parentCategoryId === ""
            ? null
            : Number(formData.parentCategoryId),
        displayOrder: Number(formData.displayOrder),
      };
      await nextApiClient.post(NEXT_API_URLS.CATEGORIES_CREATE, payload);
      toast.success(t("category.saveSuccess"));
      router.push(ROUTES.ADMIN_CATEGORIES);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t("category.saveError"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="32px"
      borderRadius="xl"
      shadow="sm"
      maxW="3xl"
    >
      <Heading size="lg" mb="24px">
        {t("category.create")}
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("category.name")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("category.namePlaceholder")}
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("category.displayOrder")}
            </Text>
            <Input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              placeholder="0"
              min={0}
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("category.parentCategory")}
            </Text>
            <select
              name="parentCategoryId"
              style={{
                height: "40px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "transparent",
                width: "100%",
              }}
              value={String(formData.parentCategoryId)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parentCategoryId: e.target.value,
                }))
              }
            >
              <option value="">{t("category.noParent")}</option>
              {parentCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("category.imageUrl")}
            </Text>
            <Input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder={t("category.imageUrlPlaceholder")}
            />
          </VStack>

          <Box gridColumn={{ md: "span 2" }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                {t("common.description")}
              </Text>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Kategori hakkında kısa bir açıklama girin..."
                rows={4}
              />
            </VStack>
          </Box>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
          >
            {t("common.cancel")}
          </Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml="8px">{t("common.save")}</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
