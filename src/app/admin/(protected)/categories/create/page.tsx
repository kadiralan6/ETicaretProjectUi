"use client"

import {
  Box, Button, Flex, Grid, Heading, Input,
  VStack, Text, Textarea
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { FiSave, FiImage } from "react-icons/fi"
import { useRouter } from "next/navigation"
import axios from "axios"

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoryCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [parentCategories, setParentCategories] = useState<Category[]>([])

  // Maps to CreateCategoryDto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    parentCategoryId: "" as string | number,
    displayOrder: 0,
  })

  // Load parent categories for dropdown
  useEffect(() => {
    axios.get("/api/categories/getAllFilter", { params: { Page: 1, PageSize: 100 } })
      .then(res => {
        const data = res.data.data?.items || res.data.data || res.data
        setParentCategories(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error("Üst kategoriler yüklenemedi:", err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        parentCategoryId: formData.parentCategoryId === "" ? null : Number(formData.parentCategoryId),
        displayOrder: Number(formData.displayOrder),
      }
      await axios.post("/api/categories/create", payload)
      alert("Kategori başarıyla kaydedildi!")
      router.push("/admin/categories")
    } catch (error: any) {
      console.error("Kategori kaydedilirken hata:", error)
      alert(error.response?.data?.error || "Kayıt işlemi başarısız oldu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="3xl">
      <Heading size="lg" mb={6}>Yeni Kategori Ekle</Heading>

      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>

          {/* Name */}
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Kategori Adı <Text as="span" color="red.500">*</Text></Text>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Elektronik" required />
          </VStack>

          {/* Display Order */}
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Sıralama (DisplayOrder)</Text>
            <Input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} placeholder="0" min={0} />
          </VStack>

          {/* Parent Category */}
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Üst Kategori</Text>
            <select
              name="parentCategoryId"
              style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'transparent', width: '100%' }}
              value={String(formData.parentCategoryId)}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, parentCategoryId: e.target.value }))
              }
            >
              <option value="">Üst Kategori Yok (Ana Kategori)</option>
              {parentCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </VStack>

          {/* Image URL */}
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Görsel URL</Text>
            <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          </VStack>

          {/* Description - full width */}
          <Box gridColumn={{ md: "span 2" }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
              <Textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="Kategori hakkında kısa bir açıklama girin..." rows={4} />
            </VStack>
          </Box>

        </Grid>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/categories")}>İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml={2}>Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
