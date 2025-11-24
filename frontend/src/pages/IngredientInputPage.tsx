import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Loader2, Plus, Sparkles, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAddMultipleIngredients, 
  usePhotoToIngredients, 
  useAnalyzeIngredients, 
  useAddHistoryEntry,
  useGetAllIngredients 
} from '@/hooks/useQueries';

export default function IngredientInputPage() {
  const navigate = useNavigate();
  const [manualInput, setManualInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Fetch current ingredients from backend
  const { data: currentIngredients = [], isLoading: isLoadingIngredients } = useGetAllIngredients();
  
  const addMultipleIngredientsMutation = useAddMultipleIngredients();
  const photoToIngredientsMutation = usePhotoToIngredients();
  const analyzeIngredientsMutation = useAnalyzeIngredients();
  const addHistoryMutation = useAddHistoryEntry();

  const handleAddManualIngredient = async () => {
    const trimmedInput = manualInput.trim();
    
    if (!trimmedInput) {
      toast.error('Please enter at least one ingredient');
      return;
    }

    try {
      // Split by comma and trim whitespace, filter out empty strings
      const ingredientNames = trimmedInput
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (ingredientNames.length === 0) {
        toast.error('Please enter valid ingredient names');
        return;
      }

      // Use the backend's addMultipleIngredients method
      const newIngredients = await addMultipleIngredientsMutation.mutateAsync({
        names: ingredientNames,
        source: 'manual',
      });

      // Clear input on success
      setManualInput('');
      
      // Show appropriate success message
      if (newIngredients.length === 1) {
        toast.success(`Added "${newIngredients[0].name}" successfully`);
      } else {
        toast.success(`Added ${newIngredients.length} ingredients successfully`);
      }
    } catch (error) {
      console.error('Error adding ingredients:', error);
      toast.error('Failed to add ingredients. Please try again.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!photoFile) {
      toast.error('Please upload a photo first');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // First, detect ingredients from photo
        const ingredientNames = await photoToIngredientsMutation.mutateAsync(base64);
        
        if (ingredientNames.length === 0) {
          toast.error('No ingredients detected in the photo');
          return;
        }
        
        // Then add them to the backend
        const newIngredients = await addMultipleIngredientsMutation.mutateAsync({
          names: ingredientNames,
          source: 'photo',
        });
        
        // Clear photo on success
        setPhotoFile(null);
        setPhotoPreview(null);
        
        toast.success(`Detected and added ${newIngredients.length} ingredient${newIngredients.length > 1 ? 's' : ''}`);
      };
      reader.readAsDataURL(photoFile);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      toast.error('Failed to analyze photo. Please try again.');
    }
  };

  const handleGenerateRecipes = async () => {
    if (currentIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    try {
      // Extract ingredient names from the current ingredients list
      const ingredientNames = currentIngredients.map((ing) => ing.name);
      
      // Call backend to analyze ingredients and generate recipes
      const recipes = await analyzeIngredientsMutation.mutateAsync(ingredientNames);
      
      // Add to history
      await addHistoryMutation.mutateAsync(currentIngredients);
      
      // Show success message
      toast.success(`Generated ${recipes.length} recipe${recipes.length > 1 ? 's' : ''}!`);
      
      // Navigate to recipes page after successful generation
      navigate({ to: '/recipes' });
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast.error('Failed to generate recipes. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Add Your Ingredients</h1>
        <p className="text-muted-foreground">
          Tell us what you have, and we'll help you create amazing meals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Type ingredient names separated by commas (e.g., tomato, cheese, bread)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., tomato, cheese, bread"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !addMultipleIngredientsMutation.isPending) {
                    handleAddManualIngredient();
                  }
                }}
                disabled={addMultipleIngredientsMutation.isPending}
              />
              <Button
                onClick={handleAddManualIngredient}
                disabled={addMultipleIngredientsMutation.isPending || !manualInput.trim()}
              >
                {addMultipleIngredientsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Upload
            </CardTitle>
            <CardDescription>Upload a photo to detect ingredients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="cursor-pointer"
                disabled={photoToIngredientsMutation.isPending || addMultipleIngredientsMutation.isPending}
              />
              {photoPreview && (
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={handleAnalyzePhoto}
              disabled={!photoFile || photoToIngredientsMutation.isPending || addMultipleIngredientsMutation.isPending}
              className="w-full"
            >
              {photoToIngredientsMutation.isPending || addMultipleIngredientsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Detect Ingredients
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Current Ingredients ({currentIngredients.length})</CardTitle>
          <CardDescription>
            These ingredients will be used to generate recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingIngredients ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : currentIngredients.length === 0 ? (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                No ingredients added yet. Add some ingredients to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentIngredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant={ingredient.source === 'photo' ? 'default' : 'secondary'}
                  className="text-sm py-2 px-3 gap-2"
                >
                  {ingredient.source === 'photo' && <Camera className="w-3 h-3" />}
                  {ingredient.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Recipes Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerateRecipes}
          disabled={currentIngredients.length === 0 || analyzeIngredientsMutation.isPending}
          className="gap-2 shadow-lg"
        >
          {analyzeIngredientsMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Recipes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Recipes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
