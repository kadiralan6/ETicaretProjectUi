"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, Textarea, Spinner, Badge, Table } from "@chakra-ui/react"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { FiSave } from "react-icons/fi"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

interface SubCategory {
  id: number;
  name: string | null;
  description: string | null;
  slug: string | null;
  imageUrl: string | null;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCategoryUpdate({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  
  // React 19 / Next 15 requires unwrap of params Promise
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    slug: "",
    displayOrder: 0,
    isActive: true,
    subCategories: [] as SubCategory[]
  })

  // Auto-generate slug when name changes manually (optional)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      name: newName,
      slug: generateSlug(newName)
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`)
        if (res.ok) {
          const json = await res.json()
          const cat = json.data || json // In case API doesn't wrap loosely
          setFormData({
            id: cat.id || id,
            name: cat.name || "",
            description: cat.description || "",
            slug: cat.slug || "",
            displayOrder: cat.displayOrder || 0,
            isActive: cat.isActive !== undefined ? cat.isActive : true,
            subCategories: cat.subCategories || []
          })
        } else {
          toast.error("Kategori bilgileri alınamadı.")
          router.push("/admin/categories")
        }
      } catch (error) {
        toast.error("Sunucuya ulaşılamadı.")
      } finally {
        setInitialLoading(false)
      }
    }
    
    if (id) {
      fetchCategory()
    }
  }, [id, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const payload = {
        ...formData,
        id: Number(id),
        displayOrder: Number(formData.displayOrder)
      }

      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success("Kategori başarıyla güncellendi!")
        router.push("/admin/categories")
      } else {
        const errorData = await res.json().catch(() => null)
        toast.error(errorData?.message || "Kategori güncellenirken bir hata oluştu.")
      }
    } catch (error) {
      toast.error("Sunucuya ulaşılamadı veya bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Flex justify="center" align="center" h="64">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="4xl">
      <Heading size="lg" mb={6}>Kategori Güncelle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Kategori Adı</Text>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Örn: Elektronik" 
              required 
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Slug (URL)</Text>
            <Input 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Örn: elektronik" 
              readOnly 
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              cursor="not-allowed"
            />
            <Text fontSize="xs" color="gray.500">Slug alanı otomatik oluşturulur ve değiştirilemez.</Text>
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Sıralama (DisplayOrder)</Text>
            <Input 
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              placeholder="0" 
              min={0}
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Durum</Text>
            <select
              style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'transparent', width: '100%' }}
              value={formData.isActive.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === "true" }))}
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
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

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/categories")}>İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml={2}>Güncelle</Text>
          </Button>
        </Flex>
      </form>

      {/* Alt Kategoriler Alanı */}
      {formData.subCategories && formData.subCategories.length > 0 && (
        <Box mt={12} pt={6} borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }}>
          <Heading size="md" mb={4}>Alt Kategorileri</Heading>
          <Box overflowX="auto" border="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} borderRadius="lg">
            <Table.Root variant="line">
              <Table.Header bg="gray.50" _dark={{ bg: "whiteAlpha.50" }}>
                <Table.Row>
                  <Table.ColumnHeader>Kategori Adı</Table.ColumnHeader>
                  <Table.ColumnHeader>Slug</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">İşlem</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {formData.subCategories.map((sub) => (
                  <Table.Row key={sub.id}>
                    <Table.Cell fontWeight="medium">{sub.name}</Table.Cell>
                    <Table.Cell color="gray.500">{sub.slug}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge colorPalette={sub.isActive ? "green" : "red"}>
                        {sub.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Link href={`/admin/categories/${sub.id}`}>
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
  )
}
