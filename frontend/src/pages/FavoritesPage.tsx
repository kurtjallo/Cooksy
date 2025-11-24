import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Clock, ChefHat, AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetFavoriteRecipes, useToggleFavorite } from '@/hooks/useQueries';

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useGetFavoriteRecipes();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      await toggleFavoriteMutation.mutateAsync(recipeId);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="w-8 h-8 text-destructive fill-destructive" />
          Favorite Recipes
        </h1>
        <p className="text-muted-foreground">
          Your saved recipes for quick access
        </p>
      </div>

      {!favorites || favorites.length === 0 ? (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No favorite recipes yet. Start exploring recipes and save your favorites!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {Number(recipe.prepTime)} min
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveFavorite(recipe.id)}
                    disabled={toggleFavoriteMutation.isPending}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Ingredients You Have:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredientsUsed.map((ing, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </div>

                {recipe.missingIngredients.length > 0 && (
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-warning-foreground">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Missing Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.missingIngredients.map((ing, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-xs border-warning/50 text-warning-foreground bg-warning/5"
                        >
                          {ing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                  <ol className="space-y-1 text-sm text-muted-foreground">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-medium text-foreground">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
