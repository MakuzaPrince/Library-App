import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCategories } from '@/data/mockData';
import { ArrowLeft, Upload, Loader2, BookPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddBook() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    totalCopies: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`"${formData.title}" has been added to the library!`);
    navigate('/books');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm">
          <Link to="/books">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
        </Button>

        {/* Header */}
        <div>
          <h1 className="page-header">Add New Book</h1>
          <p className="page-subtitle">Fill in the details to add a new book to the library</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-xl shadow-md border border-border/50 p-6 space-y-6">
            {/* Cover Upload */}
            <div>
              <Label>Book Cover</Label>
              <div className="mt-2 flex gap-6">
                <div className="w-32 h-44 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <BookPlus className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">No cover</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <Label
                    htmlFor="cover"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors w-fit"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Cover Image
                  </Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    PNG, JPG up to 5MB. Recommended size: 400x600px
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the book title"
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter the author's name"
                required
              />
            </div>

            {/* ISBN & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="978-0-000-00000-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Total Copies */}
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Number of Copies *</Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of the book..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/books')}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <BookPlus className="w-4 h-4 mr-2" />
                  Add Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
