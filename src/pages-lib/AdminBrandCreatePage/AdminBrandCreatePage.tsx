"use client";

import { useState } from "react";
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
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";

import { useTranslation } from "@/providers/TranslationProvider";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { ROUTES } from "@/constants/routes";

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

export const AdminBrandCreatePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await nextApiClient.post(NEXT_API_URLS.BRANDS_CREATE, formData);
      toast.success(t("brand.saveSuccess"));
      router.push(ROUTES.ADMIN_BRANDS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("brand.saveError"));
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
        {t("brand.create")}
      </Heading>

      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr" }} gap="24px">
          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("brand.name")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("brand.namePlaceholder")}
              required
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("common.description")}
            </Text>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Marka hakkında kısa bir açıklama girin..."
              rows={4}
            />
          </VStack>

          <VStack align="stretch" gap="8px">
            <Text fontWeight="medium" fontSize="sm">
              {t("brand.slugField")} <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder={t("brand.slugPlaceholder")}
              required
            />
            <Text fontSize="xs" color="gray.500">
              {t("brand.slugHint")}
            </Text>
          </VStack>
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
            <Text ml="8px">{t("common.save")}</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
