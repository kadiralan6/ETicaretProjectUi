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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave, FiUpload } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { productSchema, type ProductSchemaType } from "@/validations/productSchema";
import type { IBrand } from "@/interfaces/IBrand";
import type { IAdminCategory } from "@/interfaces/ICategory";

export const AdminProductCreatePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const schema = productSchema(t);

  const { control, handleSubmit, register, watch, setValue, formState: { errors } } =
    useForm<ProductSchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        code: "",
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        isFeatured: false,
        categoryId: "",
        brandId: "",
      },
    });

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CATEGORIES_ALL_FILTER, {
        params: { Page: 1, PageSize: 100 },
      });
      return res.data?.data?.results || res.data?.data || res.data || [];
    },
  });

  const { data: brandsData } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.BRANDS_GET_ALL, {
        params: { Page: 1, PageSize: 100 },
      });
      return res.data?.data?.results || res.data?.data || res.data || [];
    },
  });

  const categories: IAdminCategory[] = categoriesData ?? [];
  const brands: IBrand[] = brandsData ?? [];

  const onSubmit = async (data: ProductSchemaType) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        categoryId: parseInt(data.categoryId, 10) || 0,
        brandId: parseInt(data.brandId, 10) || 0,
      };

      const response = await nextApiClient.post(NEXT_API_URLS.PRODUCTS, payload);
      const productId = response.data?.id || response.data?.data?.id;

      if (selectedFiles.length > 0 && productId) {
        toast.loading(`${t("product.imageUploadProgress")} (0/${selectedFiles.length})...`, {
          id: "imageUpload",
        });
        for (let i = 0; i < selectedFiles.length; i++) {
          const imgData = new FormData();
          imgData.append("File", selectedFiles[i]);
          imgData.append("IsCover", i === 0 ? "true" : "false");
          imgData.append("ProductId", String(productId));
          await nextApiClient.post(NEXT_API_URLS.PRODUCT_IMAGES, imgData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.loading(
            `${t("product.imageUploadProgress")} (${i + 1}/${selectedFiles.length})...`,
            { id: "imageUpload" },
          );
        }
        toast.dismiss("imageUpload");
      }

      toast.success(t("product.saveSuccess"));
      router.push(ROUTES.ADMIN_PRODUCTS);
    } catch (error: any) {
      toast.dismiss("imageUpload");
      const errMsg = error.response?.data?.message;
      toast.error(errMsg || t("product.saveError"));
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
      maxW="4xl"
    >
      <Heading size="lg" mb="24px">
        {t("product.create")}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.name")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              {...register("name")}
              placeholder={t("product.namePlaceholder")}
            />
            {errors.name && (
              <Text color="red.500" fontSize="xs">
                {errors.name.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.code")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              {...register("code")}
              placeholder={t("product.codePlaceholder")}
            />
            {errors.code && (
              <Text color="red.500" fontSize="xs">
                {errors.code.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.brand")} <Text as="span" color="red.500">*</Text>
            </Text>
            <select
              {...register("brandId")}
              style={{
                height: "40px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "transparent",
                width: "100%",
                color: "inherit",
              }}
            >
              <option value="">{t("product.selectBrand")}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <Text color="red.500" fontSize="xs">
                {errors.brandId.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.category")} <Text as="span" color="red.500">*</Text>
            </Text>
            <select
              {...register("categoryId")}
              style={{
                height: "40px",
                padding: "0 12px",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "transparent",
                width: "100%",
                color: "inherit",
              }}
            >
              <option value="">{t("product.selectCategory")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <Text color="red.500" fontSize="xs">
                {errors.categoryId.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.stockQty")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="number"
              min={0}
              {...register("stockQuantity", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.stockQuantity && (
              <Text color="red.500" fontSize="xs">
                {errors.stockQuantity.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("product.priceField")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="number"
              step="0.01"
              min={0}
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.price && (
              <Text color="red.500" fontSize="xs">
                {errors.price.message}
              </Text>
            )}
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                {t("common.description")}
              </Text>
              <Textarea
                {...register("description")}
                placeholder="Ürün hakkında kısa bir açıklama girin..."
                rows={4}
              />
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="medium" fontSize="sm">
                {t("product.featured")}
              </Text>
              <Flex align="center" gap="8px">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <Text fontSize="sm">{t("product.featuredLabel")}</Text>
              </Flex>
            </VStack>
          </GridItem>

          {/* Image Upload */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Flex justify="space-between" align="center">
                <Text fontWeight="medium" fontSize="sm">
                  {t("product.images")}
                </Text>
                {selectedFiles.length > 0 && (
                  <Text fontSize="xs" color="gray.500">
                    {t("product.firstImageCover")}
                  </Text>
                )}
              </Flex>

              <Flex
                border="2px dashed"
                borderColor={
                  selectedFiles.length > 0 ? "purple.300" : "gray.300"
                }
                borderRadius="md"
                p="32px"
                direction="column"
                align="center"
                justify="center"
                bg={selectedFiles.length > 0 ? "purple.50" : "gray.50"}
                _dark={{
                  borderColor:
                    selectedFiles.length > 0 ? "purple.600" : "gray.600",
                  bg:
                    selectedFiles.length > 0
                      ? "rgba(128, 90, 213, 0.1)"
                      : "transparent",
                }}
                cursor="pointer"
                transition="all 0.2s"
                position="relative"
              >
                <FiUpload
                  size={28}
                  color={selectedFiles.length > 0 ? "#805AD5" : "gray"}
                />
                <Text
                  mt="12px"
                  color={
                    selectedFiles.length > 0 ? "purple.600" : "gray.500"
                  }
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} ${t("product.imagesSelected")}`
                    : t("product.imageUploadLabel")}
                </Text>
                <Input
                  type="file"
                  opacity={0}
                  position="absolute"
                  w="full"
                  h="full"
                  cursor="pointer"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </Flex>

              {selectedFiles.length > 0 && (
                <VStack align="stretch" gap="4px" mt="4px">
                  {selectedFiles.map((file, idx) => (
                    <Flex
                      key={idx}
                      align="center"
                      justify="space-between"
                      px="12px"
                      py="8px"
                      bg={idx === 0 ? "purple.50" : "gray.50"}
                      _dark={{
                        bg:
                          idx === 0
                            ? "rgba(128, 90, 213, 0.15)"
                            : "gray.700",
                        borderColor:
                          idx === 0 ? "purple.700" : "gray.600",
                      }}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={idx === 0 ? "purple.200" : "gray.200"}
                    >
                      <Text
                        fontSize="sm"
                        color={idx === 0 ? "purple.700" : "gray.600"}
                        _dark={{
                          color:
                            idx === 0 ? "purple.300" : "gray.300",
                        }}
                      >
                        {file.name}
                      </Text>
                      {idx === 0 && (
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color="purple.500"
                        >
                          {t("common.cover")}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_PRODUCTS)}
          >
            {t("common.cancel")}
          </Button>
          <Button colorPalette="purple" type="submit" loading={loading}>
            <FiSave />
            <Text ml="8px">{t("common.save")}</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
