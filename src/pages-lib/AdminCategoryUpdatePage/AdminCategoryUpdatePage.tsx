"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Spinner,
  Table,
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
import type { IAdminCategoryDetail, IAdminSubCategory } from "@/interfaces/ICategory";

const generateSlug = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

interface Props {
  params: Promise<{ id: string }>;
}

export const AdminCategoryUpdatePage = ({ params }: Props) => {
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
    displayOrder: 0,
    isActive: true,
    subCategories: [] as IAdminSubCategory[],
  });

  const { isLoading } = useQuery<IAdminCategoryDetail>({
    queryKey: QUERY_KEYS.CATEGORY_DETAIL(id),
    queryFn: async () => {
      const res = await nextApiClient.get(NEXT_API_URLS.CATEGORY_BY_ID(id));
      const cat = res.data?.data || res.data;
      setFormData({
        id: cat.id || id,
        name: cat.name || "",
        description: cat.description || "",
        slug: cat.slug || "",
        displayOrder: cat.displayOrder || 0,
        isActive: cat.isActive !== undefined ? cat.isActive : true,
        subCategories: cat.subCategories || [],
      });
      return cat;
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
      const payload = {
        ...formData,
        id: Number(id),
        displayOrder: Number(formData.displayOrder),
      };

      await nextApiClient.put(NEXT_API_URLS.CATEGORY_BY_ID(id), payload);
      toast.success(t("category.updateSuccess"));
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORY_DETAIL(id),
      });
      router.push(ROUTES.ADMIN_CATEGORIES);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t("category.updateError"),
      );
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
        {t("category.update")}
      </Heading>

      <form onSubmit={handleSave}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="24px"
        >
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("category.name")}
            </Text>
            <Input
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder={t("category.namePlaceholder")}
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
              {t("category.slugReadonly")}
            </Text>
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
                placeholder="Kategori hakkında kısa bir açıklama..."
                rows={4}
              />
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt="32px" gap="16px">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
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

      {/* Sub Categories */}
      {formData.subCategories && formData.subCategories.length > 0 && (
        <Box
          mt="48px"
          pt="24px"
          borderTop="1px solid"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.700" }}
        >
          <Heading size="md" mb="16px">
            {t("category.subCategories")}
          </Heading>
          <Box
            overflowX="auto"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
            borderRadius="lg"
          >
            <Table.Root variant="line">
              <Table.Header bg="gray.50" _dark={{ bg: "whiteAlpha.50" }}>
                <Table.Row>
                  <Table.ColumnHeader>{t("category.name")}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t("common.slug")}</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    {t("common.status")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">
                    {t("common.actions")}
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {formData.subCategories.map((sub) => (
                  <Table.Row key={sub.id}>
                    <Table.Cell fontWeight="medium">{sub.name}</Table.Cell>
                    <Table.Cell color="gray.500">{sub.slug}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge colorPalette={sub.isActive ? "green" : "red"}>
                        {sub.isActive ? t("common.active") : t("common.passive")}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Link href={ROUTES.ADMIN_CATEGORY_EDIT(String(sub.id))}>
                        <Button size="xs" variant="outline" colorPalette="purple">
                          Düzenle
                        </Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      )}
    </Box>
  );
};
