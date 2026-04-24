"use client";

import { useState, useEffect } from "react";
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
import { FiArrowLeft, FiSave, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { ROUTES } from "@/constants/routes";
import { productSchema, type ProductSchemaType } from "@/validations/productSchema";
import type { IAdminProductDetail, IProductImage } from "@/interfaces/IProduct";
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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [productImages, setProductImages] = useState<IProductImage[]>([]);
  const [pendingDeleteImages, setPendingDeleteImages] = useState<IProductImage[]>([]);
  const [pendingAddFiles, setPendingAddFiles] = useState<File[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | null>(null);
  const [hasReordered, setHasReordered] = useState(false);

  const schema = productSchema(t);

  const { data: product, isLoading } = useQuery<IAdminProductDetail>({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.PRODUCT_BY_ID(id));
      const data = res.data?.data ?? res.data;
      return {
        ...data,
        imageUrls: data?.imageUrls ?? data?.ImageUrls ?? [],
        images: data?.images ?? data?.Images ?? [],
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

  useEffect(() => {
    if (!product) return;
    if (product.images?.length) {
      setProductImages(product.images);
    } else if (product.imageUrls?.length) {
      setProductImages(
        product.imageUrls.map((url, i) => ({
          id: 0,
          productId: product.id,
          url,
          altText: null,
          isCover: i === 0,
          displayOrder: i,
        })),
      );
    }
  }, [product]);

  const onSubmit = async (data: ProductSchemaType) => {
    if (!product) return;
    setSaving(true);
    try {
      // 1. Ürün alanlarını güncelle
      await nextApiClient.put(NEXT_API_URLS.PRODUCT_BY_ID(id), {
        id: product.id,
        ...data,
        categoryId: parseInt(data.categoryId, 10),
        brandId: parseInt(data.brandId, 10),
      });

      // 2. İşaretlenen resimleri sil (gerçek ID'si olanlar)
      for (const img of pendingDeleteImages) {
        if (img.id > 0) {
          await nextApiClient.delete(NEXT_API_URLS.PRODUCT_IMAGES_BY_ID(img.id));
        }
      }
      if (pendingDeleteImages.length > 0) setPendingDeleteImages([]);

      // 3. Yeni eklenen resimleri yükle
      if (pendingAddFiles.length > 0) {
        const formData = new FormData();
        pendingAddFiles.forEach((file) => formData.append("Files", file));
        formData.append("ProductId", String(product.id));
        formData.append("AltText", data.name);
        await nextApiClient.post(NEXT_API_URLS.PRODUCT_IMAGES, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPendingAddFiles([]);
      }

      // 4. Sadece sıralama değiştiyse güncelle
      if (hasReordered) {
        const imagesWithIds = productImages.filter((img) => img.id > 0);
        if (imagesWithIds.length > 0) {
          await nextApiClient.put(
            NEXT_API_URLS.PRODUCT_IMAGES,
            productImages.map((img, i) => ({ id: img.id, displayOrder: i })),
          );
        }
        setHasReordered(false);
      }

      toast.success(t("product.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_DETAIL(id) });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || t("product.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDeleteImage = (image: IProductImage) => {
    setPendingDeleteImages((prev) => [...prev, image]);
    setProductImages((prev) => prev.filter((img) => img.url !== image.url));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);
    setPendingAddFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newImages = [...productImages];
    const [dragged] = newImages.splice(dragIndex, 1);
    newImages.splice(targetIndex, 0, dragged);
    setProductImages(newImages);
    setDragIndex(null);
    setDragOverIndex(null);
    setHasReordered(true);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
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

          {/* Image management */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap="12px">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                {t("product.existingImages")}
              </Text>
              {productImages.length > 0 ? (
                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap="12px"
                >
                  {productImages.map((image, index) => (
                    <Box
                      key={image.url}
                      position="relative"
                      borderRadius="lg"
                      overflow="hidden"
                      shadow="sm"
                      border="2px solid"
                      borderColor={
                        dragOverIndex === index && dragIndex !== index
                          ? "purple.400"
                          : "transparent"
                      }
                      draggable
                      cursor="grab"
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) =>
                        handleDragOver(e as unknown as React.DragEvent, index)
                      }
                      onDrop={(e) =>
                        handleDrop(e as unknown as React.DragEvent, index)
                      }
                      onDragEnd={handleDragEnd}
                      onMouseEnter={() => setHoveredImageUrl(image.url)}
                      onMouseLeave={() => setHoveredImageUrl(null)}
                      opacity={dragIndex === index ? 0.4 : 1}
                      transition="opacity 0.15s, border-color 0.15s"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} - görsel ${index + 1}`}
                        w="full"
                        h="130px"
                        objectFit="cover"
                        draggable={false}
                        pointerEvents="none"
                      />
                      {/* Dark overlay on hover */}
                      <Box
                        position="absolute"
                        inset={0}
                        bg="blackAlpha.400"
                        opacity={hoveredImageUrl === image.url ? 1 : 0}
                        transition="opacity 0.15s"
                        pointerEvents="none"
                      />
                      {/* Delete button */}
                      <Box
                        position="absolute"
                        top="6px"
                        right="6px"
                        bg="red.500"
                        color="white"
                        borderRadius="full"
                        w="24px"
                        h="24px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        opacity={hoveredImageUrl === image.url ? 1 : 0}
                        transition="opacity 0.15s, background 0.15s"
                        _hover={{ bg: "red.600" }}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handleMarkDeleteImage(image);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <FiX size={13} />
                      </Box>
                      {/* Cover badge */}
                      {image.isCover && (
                        <Box
                          position="absolute"
                          bottom="5px"
                          left="5px"
                          bg="blackAlpha.700"
                          px="6px"
                          py="2px"
                          borderRadius="sm"
                          fontSize="9px"
                          fontWeight="bold"
                          color="white"
                          pointerEvents="none"
                        >
                          Kapak
                        </Box>
                      )}
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
                borderColor={pendingAddFiles.length > 0 ? "purple.300" : "gray.300"}
                borderRadius="md"
                p="24px"
                direction="column"
                align="center"
                justify="center"
                bg={pendingAddFiles.length > 0 ? "purple.50" : "gray.50"}
                _dark={{
                  borderColor: pendingAddFiles.length > 0 ? "purple.600" : "gray.600",
                  bg: pendingAddFiles.length > 0
                    ? "rgba(128, 90, 213, 0.1)"
                    : "transparent",
                }}
                position="relative"
                cursor="pointer"
              >
                <FiUpload
                  size={24}
                  color={pendingAddFiles.length > 0 ? "#805AD5" : "gray"}
                />
                <Text
                  mt="10px"
                  color={pendingAddFiles.length > 0 ? "purple.600" : "gray.500"}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {pendingAddFiles.length > 0
                    ? `${pendingAddFiles.length} resim seçildi`
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
                  onChange={handleFileSelect}
                />
              </Flex>
              {pendingAddFiles.length > 0 && (
                <VStack align="stretch" gap="4px">
                  {pendingAddFiles.map((file, index) => (
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
                      <Box
                        onClick={() =>
                          setPendingAddFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        color="gray.400"
                        _hover={{ color: "red.500" }}
                        style={{ cursor: "pointer" }}
                      >
                        <FiX size={14} />
                      </Box>
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
