'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
})

export default function NewProductPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    price: '',
    delivery_type: 'file_download',
    storage_path: '',
    image_url: '',
    access_expiry_hours: '',
    download_limit: '',
    status: 'active'
  })

  // Quill editor modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), [])

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'link'
  ]

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      toast.error('Admin access required')
      router.push('/')
    }
  }, [user, profile, authLoading])

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      if (type === 'product') {
        setFormData({ ...formData, storage_path: filePath })
        toast.success('Product file uploaded successfully')
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('product-files')
          .getPublicUrl(filePath)
        
        setFormData({ ...formData, image_url: publicUrl })
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        long_description: formData.long_description || null,
        price: parseFloat(formData.price),
        delivery_type: formData.delivery_type,
        storage_path: formData.storage_path,
        image_url: formData.image_url || null,
        access_expiry_hours: formData.access_expiry_hours ? parseInt(formData.access_expiry_hours) : null,
        download_limit: formData.download_limit ? parseInt(formData.download_limit) : null,
        status: formData.status
      }

      const { error } = await supabase
        .from('products')
        .insert([productData])

      if (error) throw error

      toast.success('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create New Product</CardTitle>
              <CardDescription>Add a new digital product to your store</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Input
                    id="description"
                    placeholder="Brief description for product cards"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Detailed Description (Rich Text)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add formatted content with headings, lists, colors, and more. This appears on the product detail page.
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.long_description}
                      onChange={(value) => setFormData({ ...formData, long_description: value })}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white"
                      style={{ minHeight: '200px' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery_type">Delivery Type *</Label>
                    <Select
                      value={formData.delivery_type}
                      onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="file_download">File Download</SelectItem>
                        <SelectItem value="folder">Multiple Files</SelectItem>
                        <SelectItem value="google_drive_link">Google Drive Link</SelectItem>
                        <SelectItem value="external_url">External URL</SelectItem>
                        <SelectItem value="time_limited_access">Time Limited Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage_path">Product File/Link *</Label>
                  {formData.delivery_type === 'file_download' || formData.delivery_type === 'folder' ? (
                    <div className="space-y-2">
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'product')}
                        disabled={uploading}
                      />
                      {formData.storage_path && (
                        <p className="text-sm text-green-600">File uploaded: {formData.storage_path}</p>
                      )}
                    </div>
                  ) : (
                    <Input
                      id="storage_path"
                      placeholder="https://drive.google.com/... or any URL"
                      value={formData.storage_path}
                      onChange={(e) => setFormData({ ...formData, storage_path: e.target.value })}
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image (Optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    disabled={uploading}
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="access_expiry">Access Expiry (hours)</Label>
                    <Input
                      id="access_expiry"
                      type="number"
                      min="0"
                      placeholder="Leave empty for lifetime"
                      value={formData.access_expiry_hours}
                      onChange={(e) => setFormData({ ...formData, access_expiry_hours: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="download_limit">Download Limit</Label>
                    <Input
                      id="download_limit"
                      type="number"
                      min="0"
                      placeholder="Leave empty for unlimited"
                      value={formData.download_limit}
                      onChange={(e) => setFormData({ ...formData, download_limit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || uploading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  )
}
