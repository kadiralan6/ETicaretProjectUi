"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowLeft, FiSave, FiTrash2, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { productSchema, type ProductSchemaType } from "@/validations/productSchema";
import type { IAdminProductDetail } from "@/interfaces/IProduct";
import type { IBrand } from "@/interfaces/IBrand";
import type { IAdminCategory } from "@/interfaces/ICategory";

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <VStack align="stretch" gap="8px">
    <Text fontWeight="semibold" fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text
      fontWeight="medium"
      fontSize="17px"
      color="gray.800"
      _dark={{ color: "gray.100" }}
    >
      {value}
    </Text>
  </VStack>
);

export const AdminProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const schema = productSchema(t);

  const { data: product, isLoading } = useQuery<IAdminProductDetail>({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.PRODUCT_BY_ID(id));
      const data = res.data?.data ?? res.data;
      return {
        ...data,
        imageUrls: data?.imageUrls ?? data?.ImageUrls ?? [],
      };
    },
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CATEGORIES_ALL_FILTER, {
        params: { Page: 1, PageSize: 100 },
      });
      return res.data?.data?.results || [];
    },
  });

  const { data: brandsData } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.BRANDS_GET_ALL, {
        params: { Page: 1, PageSize: 100 },
      });
      return res.data?.data?.results || [];
    },
  });

  const categories: IAdminCategory[] = categoriesData ?? [];
  const brands: IBrand[] = brandsData ?? [];

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ProductSchemaType>({
      resolver: zodResolver(schema),
      values: product
        ? {
            code: product.code ?? "",
            name: product.name ?? "",
            description: product.description ?? "",
            price: product.price ?? 0,
            stockQuantity: product.stockQuantity ?? 0,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            categoryId: String(product.categoryId ?? ""),
            brandId: String(product.brandId ?? ""),
          }
        : undefined,
    });

  const isActive = watch("isActive" as keyof ProductSchemaType);
  const isFeatured = watch("isFeatured" as keyof ProductSchemaType);

  const onSubmit = async (data: ProductSchemaType) => {
    if (!product) return;
    setSaving(true);

    try {
      await nextApiClient.put(NEXT_API_URLS.PRODUCT_BY_ID(id), {
        id: product.id,
        ...data,
        categoryId: parseInt(data.categoryId, 10),
        brandId: parseInt(data.brandId, 10),
      });

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();
        selectedFiles.forEach((file) => imageFormData.append("Files", file));
        imageFormData.append("IsCover", "true");
        imageFormData.append("ProductId", String(product.id));

        await nextApiClient.put(NEXT_API_URLS.PRODUCT_IMAGES, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(t("product.updateSuccess"));
      setSelectedFiles([]);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || t("product.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const confirmed = window.confirm(
      `"${product.name}" ${t("product.deleteConfirm")}`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await nextApiClient.delete(NEXT_API_URLS.PRODUCT_BY_ID(id));
      toast.success(t("product.deleteSuccess"));
      router.push(ROUTES.ADMIN_PRODUCTS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || t("product.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!product) {
    return (
      <Box p="32px" textAlign="center">
        <Text color="gray.500" mb="16px">
          {t("product.notFound")}
        </Text>
        <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN_PRODUCTS)}>
          <FiArrowLeft style={{ marginRight: 8 }} /> {t("common.back")}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      p="40px"
      borderRadius="2xl"
      shadow="sm"
      maxW="5xl"
    >
      <Flex justify="space-between" align="center" mb="40px">
        <Flex align="center" gap="16px">
          <Box
            as="button"
            onClick={() => router.push(ROUTES.ADMIN_PRODUCTS)}
            color="gray.600"
            _hover={{ color: "black", transform: "translateX(-2px)" }}
            transition="all 0.2s"
          >
            <FiArrowLeft size={22} />
          </Box>
          <Box>
            <Heading size="xl" fontWeight="semibold" letterSpacing="tight">
              {t("product.update")}
            </Heading>
            <Text mt="4px" color="gray.500">
              {t("product.updateDesc")}
            </Text>
          </Box>
        </Flex>
        <Flex gap="12px" align="center">
          <Badge
            variant="subtle"
            colorPalette={isActive ? "green" : "red"}
            px="16px"
            py={1.5}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
          >
            {isActive ? t("common.active") : t("common.passive")}
          </Badge>
          {isFeatured && (
            <Badge
              variant="subtle"
              colorPalette="purple"
              px="16px"
              py={1.5}
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
            >
              {t("common.featured")}
            </Badge>
          )}
        </Flex>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          rowGap="32px"
          columnGap="48px"
        >
          {/* Readonly fields */}
          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("common.slug")}
            </Text>
            <Input
              value={product.slug}
              readOnly
              bg="gray.50"
              color="gray.600"
              _dark={{ bg: "whiteAlpha.50", color: "gray.400" }}
              cursor="not-allowed"
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("common.createdAt")}
            </Text>
            <Input
              value={new Date(product.createdAt).toLocaleString("tr-TR")}
              readOnly
              bg="gray.50"
              color="gray.600"
              _dark={{ bg: "whiteAlpha.50", color: "gray.400" }}
              cursor="not-allowed"
            />
          </VStack>

          {/* Editable fields */}
          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.name")}
            </Text>
            <Input {...register("name")} placeholder="Ürün adını girin" />
            {errors.name && (
              <Text color="red.500" fontSize="xs">
                {errors.name.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.code")}
            </Text>
            <Input
              {...register("code")}
              placeholder="Ürün kodunu girin"
            />
            {errors.code && (
              <Text color="red.500" fontSize="xs">
                {errors.code.message}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.brand")}
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
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.category")}
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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.priceField")}
            </Text>
            <Input
              type="number"
              step="0.01"
              min={0}
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("product.stockQty")}
            </Text>
            <Input
              type="number"
              min={0}
              {...register("stockQuantity", { valueAsNumber: true })}
              placeholder="0"
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {t("common.status")}
            </Text>
            <select
              {...register("isActive" as keyof ProductSchemaType)}
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
              <option value="true">{t("common.active")}</option>
              <option value="false">{t("common.passive")}</option>
            </select>
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                {t("product.featured")}
              </Text>
              <Flex align="center" gap="8px">
                <input
                  type="checkbox"
                  {...register("isFeatured" as keyof ProductSchemaType)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <Text fontSize="sm">{t("product.featuredCheck")}</Text>
              </Flex>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                {t("common.description")}
              </Text>
              <Textarea
                {...register("description")}
                rows={5}
                placeholder="Ürün açıklamasını girin"
              />
            </VStack>
          </GridItem>

          {/* Existing images */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="16px">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                {t("product.existingImages")}
              </Text>
              {product.imageUrls?.length > 0 ? (
                <Grid
                  templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap="24px"
                >
                  {product.imageUrls.map((imageUrl, index) => (
                    <Box
                      key={`${imageUrl}-${index}`}
                      overflow="hidden"
                      borderRadius="2xl"
                      shadow="sm"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.name} - görsel ${index + 1}`}
                        w="full"
                        h="260px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Text color="gray.500" fontSize="sm">
                  {t("product.noImages")}
                </Text>
              )}
            </VStack>
          </GridItem>

          {/* Image upload */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="8px">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                {t("product.imagesUpdate")}
              </Text>
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
                position="relative"
                cursor="pointer"
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
                    ? `${selectedFiles.length} ${t("product.newImagesSelected")}`
                    : t("product.imageUploadNew")}
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
                    if (e.target.files?.length) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </Flex>
              {selectedFiles.length > 0 && (
                <VStack align="stretch" gap="4px">
                  {selectedFiles.map((file, index) => (
                    <Flex
                      key={`${file.name}-${index}`}
                      justify="space-between"
                      align="center"
                      px="12px"
                      py="8px"
                      bg="gray.50"
                      _dark={{ bg: "gray.700" }}
                      borderRadius="md"
                    >
                      <Text fontSize="sm">{file.name}</Text>
                      {index === 0 && (
                        <Text fontSize="xs" color="purple.500">
                          {t("common.cover")}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}
            </VStack>
          </GridItem>

          {/* Actions */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Flex
              justify="space-between"
              align="center"
              mt="24px"
              gap="16px"
              flexWrap="wrap"
            >
              <Flex gap="12px" align="center">
                {product.modifiedAt && (
                  <DetailField
                    label={t("common.lastUpdated")}
                    value={new Date(product.modifiedAt).toLocaleString("tr-TR")}
                  />
                )}
              </Flex>
              <Flex gap="12px">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push(ROUTES.ADMIN_PRODUCTS)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  colorPalette="red"
                  variant="outline"
                  type="button"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  <FiTrash2 />
                  <Text ml="8px">{t("common.delete")}</Text>
                </Button>
                <Button colorPalette="purple" type="submit" loading={saving}>
                  <FiSave />
                  <Text ml="8px">{t("product.update")}</Text>
                </Button>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};
