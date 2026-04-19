"use client"

import {
  Box, Flex, Grid, GridItem, Heading, Text, Badge, Button, Spinner, VStack, Image, Input, Textarea,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { FiArrowLeft, FiSave, FiTrash2, FiUpload } from "react-icons/fi"
import type { AdminProductDetail } from "@/interfaces/product"
import type { Brand } from "@/interfaces/brand"
import type { Category } from "@/interfaces/category"
import { productSchema } from "@/validations/productValidation"

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [product, setProduct] = useState<AdminProductDetail | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    isActive: true,
    isFeatured: false,
    categoryId: "",
    brandId: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fetchedProductIdRef = useRef<string | null>(null)
  const loadedOptionsRef = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (loadedOptionsRef.current) {
      return
    }

    loadedOptionsRef.current = true

    Promise.all([
      axios.get("/api/categories/getAllFilter", { params: { Page: 1, PageSize: 100 } }),
      axios.get("/api/brands/getAll", { params: { Page: 1, PageSize: 100 } }),
    ])
      .then(([categoriesResponse, brandsResponse]) => {
        setCategories(categoriesResponse.data?.data?.results || categoriesResponse.data?.data || categoriesResponse.data || [])
        setBrands(brandsResponse.data?.data?.results || brandsResponse.data?.data || brandsResponse.data || [])
      })
      .catch(() => {
        loadedOptionsRef.current = false
        toast.error("Kategori veya marka bilgileri yüklenemedi.")
      })
  }, [])

  useEffect(() => {
    if (!id || fetchedProductIdRef.current === id) {
      return
    }

    fetchedProductIdRef.current = id
    setLoading(true)

    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data
        const normalizedProduct = {
          ...data,
          imageUrls: data?.imageUrls ?? data?.ImageUrls ?? [],
        }
        setProduct(normalizedProduct)
        setFormData({
          code: normalizedProduct.code ?? "",
          name: normalizedProduct.name ?? "",
          description: normalizedProduct.description ?? "",
          price: String(normalizedProduct.price ?? ""),
          stockQuantity: String(normalizedProduct.stockQuantity ?? ""),
          isActive: Boolean(normalizedProduct.isActive),
          isFeatured: Boolean(normalizedProduct.isFeatured),
          categoryId: String(normalizedProduct.categoryId ?? ""),
          brandId: String(normalizedProduct.brandId ?? ""),
        })
      })
      .catch(() => {
        fetchedProductIdRef.current = null
        toast.error("Ürün bilgileri yüklenemedi.")
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) {
      return
    }

    setErrors({})

    const parsed = productSchema.safeParse({
      ...formData,
      price: parseFloat(formData.price) || 0,
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
    })

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Lütfen form alanlarını kontrol edin.")
      return
    }

    setSaving(true)

    try {
      await axios.put(`/api/products/${id}`, {
        id: product.id,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        categoryId: parseInt(formData.categoryId, 10),
        brandId: parseInt(formData.brandId, 10),
      })

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData()
        selectedFiles.forEach((file) => {
          imageFormData.append("Files", file)
        })
        imageFormData.append("IsCover", "true")
        imageFormData.append("ProductId", String(product.id))

        await axios.put("/api/productImages", imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      toast.success("Ürün başarıyla güncellendi.")
      fetchedProductIdRef.current = null
      setSelectedFiles([])

      const refreshedResponse = await axios.get(`/api/products/${id}`)
      const refreshedData = refreshedResponse.data?.data ?? refreshedResponse.data
      const normalizedProduct = {
        ...refreshedData,
        imageUrls: refreshedData?.imageUrls ?? refreshedData?.ImageUrls ?? [],
      }
      setProduct(normalizedProduct)
      setFormData({
        code: normalizedProduct.code ?? "",
        name: normalizedProduct.name ?? "",
        description: normalizedProduct.description ?? "",
        price: String(normalizedProduct.price ?? ""),
        stockQuantity: String(normalizedProduct.stockQuantity ?? ""),
        isActive: Boolean(normalizedProduct.isActive),
        isFeatured: Boolean(normalizedProduct.isFeatured),
        categoryId: String(normalizedProduct.categoryId ?? ""),
        brandId: String(normalizedProduct.brandId ?? ""),
      })
        } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      toast.error(errorMessage || "Ürün güncellenemedi.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product) {
      return
    }

    const confirmed = window.confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)
    try {
      await axios.delete(`/api/products/${id}`)
      toast.success("Ürün silindi.")
      router.push("/admin/products")
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      toast.error(errorMessage || "Ürün silinemedi.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  if (!product) {
    return (
      <Box p={8} textAlign="center">
        <Text color="gray.500" mb={4}>Ürün bulunamadı.</Text>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          <FiArrowLeft style={{ marginRight: 8 }} /> Geri Dön
        </Button>
      </Box>
    )
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={10} borderRadius="2xl" shadow="sm" maxW="5xl">
      <Flex justify="space-between" align="center" mb={10}>
        <Flex align="center" gap={4}>
          <Box
            as="button"
            onClick={() => router.push("/admin/products")}
            color="gray.600"
            _hover={{ color: "black", transform: "translateX(-2px)" }}
            transition="all 0.2s"
          >
            <FiArrowLeft size={22} />
          </Box>
          <Box>
            <Heading size="xl" fontWeight="semibold" letterSpacing="tight">Ürün Güncelle</Heading>
            <Text mt={1} color="gray.500">Ürün bilgilerini ve görsellerini bu sayfadan güncelleyebilirsiniz.</Text>
          </Box>
        </Flex>
        <Flex gap={3} align="center">
          <Badge variant="subtle" colorPalette={formData.isActive ? "green" : "red"} px={4} py={1.5} borderRadius="full" fontSize="sm" fontWeight="medium">
            {formData.isActive ? "Aktif" : "Pasif"}
          </Badge>
          {formData.isFeatured && (
            <Badge variant="subtle" colorPalette="purple" px={4} py={1.5} borderRadius="full" fontSize="sm" fontWeight="medium">
              Öne Çıkan
            </Badge>
          )}
        </Flex>
      </Flex>

      <form onSubmit={handleUpdate}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} rowGap={8} columnGap={12}>
          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Slug</Text>
            <Input 
              value={product.slug} 
              readOnly 
              bg="gray.50" 
              color="gray.600" 
              _dark={{ bg: "whiteAlpha.50", color: "gray.400" }} 
              cursor="not-allowed"
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Oluşturulma Tarihi</Text>
            <Input 
              value={new Date(product.createdAt).toLocaleString("tr-TR")} 
              readOnly 
              bg="gray.50" 
              color="gray.600"
              _dark={{ bg: "whiteAlpha.50", color: "gray.400" }} 
              cursor="not-allowed"
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Ürün Adı</Text>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ürün adını girin" />
            {errors.name && <Text color="red.500" fontSize="xs">{errors.name}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Ürün Kodu</Text>
            <Input name="code" value={formData.code} onChange={handleChange} placeholder="Ürün kodunu girin" />
            {errors.code && <Text color="red.500" fontSize="xs">{errors.code}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Marka</Text>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              style={{ height: "40px", padding: "0 12px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "transparent", width: "100%", color: "inherit" }}
            >
              <option value="">Marka Seçin</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brandId && <Text color="red.500" fontSize="xs">{errors.brandId}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Kategori</Text>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{ height: "40px", padding: "0 12px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "transparent", width: "100%", color: "inherit" }}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId && <Text color="red.500" fontSize="xs">{errors.categoryId}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Fiyat</Text>
            <Input type="number" step="0.01" min={0} name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
            {errors.price && <Text color="red.500" fontSize="xs">{errors.price}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Stok Adeti</Text>
            <Input type="number" min={0} name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" />
            {errors.stockQuantity && <Text color="red.500" fontSize="xs">{errors.stockQuantity}</Text>}
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">Durum</Text>
            <select
              value={String(formData.isActive)}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === "true" }))}
              style={{ height: "40px", padding: "0 12px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "transparent", width: "100%", color: "inherit" }}
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">Öne Çıkan Ürün</Text>
              <Flex align="center" gap={2}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <Text fontSize="sm">Bu ürünü öne çıkar</Text>
              </Flex>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">Açıklama</Text>
              <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Ürün açıklamasını girin" />
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={4}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">Mevcut Görseller</Text>
              {product.imageUrls?.length > 0 ? (
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {product.imageUrls.map((imageUrl, index) => (
                    <Box key={`${imageUrl}-${index}`} overflow="hidden" borderRadius="2xl" shadow="sm">
                      <Image src={imageUrl} alt={`${product.name} - görsel ${index + 1}`} w="full" h="260px" objectFit="cover" />
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Text color="gray.500" fontSize="sm">Kayıtlı görsel bulunmuyor.</Text>
              )}
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="semibold" fontSize="sm" color="gray.500">Görselleri Güncelle</Text>
                
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
                position="relative"
                cursor="pointer"
              >
                <FiUpload size={28} color={selectedFiles.length > 0 ? "#805AD5" : "gray"} />
                <Text mt={3} color={selectedFiles.length > 0 ? "purple.600" : "gray.500"} fontWeight="medium" fontSize="sm">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} yeni görsel seçildi` : "Yeni görseller seçmek için tıklayın"}
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
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  }}
                />
              </Flex>
              {selectedFiles.length > 0 && (
                <VStack align="stretch" gap={1}>
                  {selectedFiles.map((file, index) => (
                    <Flex key={`${file.name}-${index}`} justify="space-between" align="center" px={3} py={2} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="md">
                      <Text fontSize="sm">{file.name}</Text>
                      {index === 0 && <Text fontSize="xs" color="purple.500">Kapak</Text>}
                    </Flex>
                  ))}
                </VStack>
              )}
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Flex justify="space-between" align="center" mt={6} gap={4} flexWrap="wrap">
              <Flex gap={3} align="center">
                {product.modifiedAt && <DetailField label="Son Güncelleme" value={new Date(product.modifiedAt).toLocaleString("tr-TR")} />}
              </Flex>
              <Flex gap={3}>
                <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>İptal</Button>
                <Button colorPalette="red" variant="outline" type="button" onClick={handleDelete} loading={deleting}>
                  <FiTrash2 />
                  <Text ml={2}>Sil</Text>
                </Button>
                <Button colorPalette="purple" type="submit" loading={saving}>
                  <FiSave />
                  <Text ml={2}>Güncelle</Text>
                </Button>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </form>
    </Box>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight="semibold" fontSize="sm" color="gray.500">{label}</Text>
      <Text fontWeight="medium" fontSize="17px" color="gray.800" _dark={{ color: "gray.100" }}>{value}</Text>
    </VStack>
  )
}
