"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { FiSave, FiUpload } from "react-icons/fi"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { productSchema } from "@/validations/productValidation"
import type { Brand } from "@/interfaces/brand"
import type { Category } from "@/interfaces/category"

export default function AdminProductCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    isFeatured: false,
    categoryId: "",
    brandId: ""
  })

  useEffect(() => {
    // Kategorileri yükle
    axios.get("/api/categories/getAllFilter", { params: { Page: 1, PageSize: 100 } })
      .then(res => setCategories(res.data?.data?.results || res.data?.data || res.data || []))
      .catch((error) => {
        console.error("Kategoriler yüklenemedi", error)
        toast.error("Kategoriler yüklenemedi")
      })

    // Markaları yükle
    axios.get("/api/brands/getAll", { params: { Page: 1, PageSize: 100 } })
      .then(res => setBrands(res.data?.data?.results || res.data?.data || res.data || []))
      .catch((error) => {
        console.error("Markalar yüklenemedi", error)
        toast.error("Markalar yüklenemedi")
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = productSchema.safeParse({
      ...formData,
      price: parseFloat(formData.price) || 0,
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
    })

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as string
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      toast.error("Lütfen form alanlarını kontrol edin.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10) || 0,
        brandId: parseInt(formData.brandId, 10) || 0,
      }
      
      const response = await axios.post("/api/products", payload)
      const productId = response.data?.id || response.data?.data?.id

      if (selectedFiles.length > 0 && productId) {
        toast.loading(`Görseller yükleniyor (0/${selectedFiles.length})...`, { id: "imageUpload" });
        for (let i = 0; i < selectedFiles.length; i++) {
          const imgData = new FormData();
          imgData.append("File", selectedFiles[i]);
          imgData.append("IsCover", i === 0 ? "true" : "false");
          imgData.append("ProductId", String(productId));
          await axios.post("/api/productImages", imgData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          toast.loading(`Görseller yükleniyor (${i + 1}/${selectedFiles.length})...`, { id: "imageUpload" });
        }
        toast.dismiss("imageUpload");
      }

      toast.success("Ürün başarıyla kaydedildi!")
      router.push("/admin/products")
    } catch (error) {
      toast.dismiss("imageUpload");
      const errMsg = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      toast.error(errMsg || "Kayıt işlemi başarısız oldu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="4xl">
      <Heading size="lg" mb={6}>Yeni Ürün Ekle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Ürün Adı <Text as="span" color="red.500">*</Text></Text>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Örn: iPhone 15 Pro" required />
            {errors.name && <Text color="red.500" fontSize="xs">{errors.name}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Ürün Kodu <Text as="span" color="red.500">*</Text></Text>
            <Input name="code" value={formData.code} onChange={handleChange} placeholder="Örn: PRD-001" required />
            {errors.code && <Text color="red.500" fontSize="xs">{errors.code}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Marka <Text as="span" color="red.500">*</Text></Text>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'transparent', width: '100%', color: 'inherit' }}
              required
            >
              <option value="">Marka Seçin</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.brandId && <Text color="red.500" fontSize="xs">{errors.brandId}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Kategori <Text as="span" color="red.500">*</Text></Text>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'transparent', width: '100%', color: 'inherit' }}
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <Text color="red.500" fontSize="xs">{errors.categoryId}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Stok Adeti <Text as="span" color="red.500">*</Text></Text>
            <Input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" required min={0} />
            {errors.stockQuantity && <Text color="red.500" fontSize="xs">{errors.stockQuantity}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Fiyat (₺) <Text as="span" color="red.500">*</Text></Text>
            <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required min={0} />
            {errors.price && <Text color="red.500" fontSize="xs">{errors.price}</Text>}
          </VStack>
          
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Ürün hakkında kısa bir açıklama girin..." 
                rows={4} 
              />
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Öne Çıkan Ürün</Text>
              <Flex align="center" gap={2}>
                <input 
                  type="checkbox" 
                  name="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={(e) => setFormData(prev => ({...prev, isFeatured: e.target.checked}))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <Text fontSize="sm">Evet, bu ürünü öne çıkar</Text>
              </Flex>
            </VStack>
          </GridItem>

          {/* Image Upload spanning 2 columns */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="medium" fontSize="sm">Ürün Görselleri Ekle</Text>
                {selectedFiles.length > 0 && (
                  <Text fontSize="xs" color="gray.500">
                    İlk görsel kapak olarak ayarlanır
                  </Text>
                )}
              </Flex>

              <Flex
                border="2px dashed"
                borderColor={selectedFiles.length > 0 ? "purple.300" : "gray.300"}
                borderRadius="md"
                p={8}
                direction="column"
                align="center"
                justify="center"
                bg={selectedFiles.length > 0 ? "purple.50" : "gray.50"}
                _dark={{ borderColor: selectedFiles.length > 0 ? "purple.600" : "gray.600", bg: selectedFiles.length > 0 ? "rgba(128, 90, 213, 0.1)" : "transparent" }}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                cursor="pointer"
                transition="all 0.2s"
                position="relative"
              >
                <FiUpload size={28} color={selectedFiles.length > 0 ? "#805AD5" : "gray"} />
                <Text mt={3} color={selectedFiles.length > 0 ? "purple.600" : "gray.500"} fontWeight="medium" fontSize="sm">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} görsel seçildi`
                    : "Görsel seçmek için tıklayın (çoklu seçim desteklenir)"}
                </Text>
                <Input
                  type="file"
                  opacity={0} position="absolute" w="full" h="full" cursor="pointer" accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  }}
                />
              </Flex>

              {selectedFiles.length > 0 && (
                <VStack align="stretch" gap={1} mt={1}>
                  {selectedFiles.map((file, idx) => (
                    <Flex
                      key={idx}
                      align="center"
                      justify="space-between"
                      px={3}
                      py={2}
                      bg={idx === 0 ? "purple.50" : "gray.50"}
                      _dark={{ bg: idx === 0 ? "rgba(128, 90, 213, 0.15)" : "gray.700", borderColor: idx === 0 ? "purple.700" : "gray.600" }}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={idx === 0 ? "purple.200" : "gray.200"}
                    >
                      <Text fontSize="sm" color={idx === 0 ? "purple.700" : "gray.600"} _dark={{ color: idx === 0 ? "purple.300" : "gray.300" }}>
                        {file.name}
                      </Text>
                      {idx === 0 && (
                        <Text fontSize="xs" fontWeight="bold" color="purple.500">Kapak</Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}
            </VStack>
          </GridItem>

        </Grid>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading}>
            <FiSave />
            <Text ml={2}>Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
