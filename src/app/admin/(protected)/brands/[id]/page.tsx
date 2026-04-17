"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, Textarea, Spinner } from "@chakra-ui/react"
import { useState, useEffect, use } from "react"
import { FiSave } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { GET_BRAND_BY_ID, UPDATE_BRAND } from "@/constants/apiEndpoints"
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

export default function AdminBrandUpdate({ params }: { params: Promise<{ id: string }> }) {
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
    slug: ""
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
    const fetchBrand = async () => {
      try {
        const res = await fetch(GET_BRAND_BY_ID(id))
        if (res.ok) {
          const data = await res.json()
          setFormData({
            id: data.id || id,
            name: data.name || "",
            description: data.description || "",
            slug: data.slug || ""
          })
        } else {
          toast.error("Marka bilgileri alınamadı.")
          router.push("/admin/brands")
        }
      } catch (error) {
        toast.error("Sunucuya ulaşılamadı.")
      } finally {
        setInitialLoading(false)
      }
    }
    
    if (id) {
      fetchBrand()
    }
  }, [id, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(UPDATE_BRAND, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success("Marka başarıyla güncellendi!")
        router.push("/admin/brands")
      } else {
        const errorData = await res.json().catch(() => null)
        toast.error(errorData?.message || "Marka güncellenirken bir hata oluştu.")
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
      <Heading size="lg" mb={6}>Marka Güncelle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Marka Adı</Text>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleNameChange} // Use handleNameChange for auto-slug update
              placeholder="Örn: Apple" 
              required 
            />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Slug (URL)</Text>
            <Input 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Örn: apple" 
              required 
            />
          </VStack>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Açıklama</Text>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Marka hakkında kısa bir açıklama..." 
                rows={4}
              />
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button" onClick={() => router.push("/admin/brands")}>İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml={2}>Güncelle</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
