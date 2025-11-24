import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Ingredient, Recipe, HistoryEntry } from '@/backend';

// Ingredient queries
export function useAddIngredient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, source }: { name: string; source: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addIngredient(name, source);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useAddMultipleIngredients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ names, source }: { names: string[]; source: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addMultipleIngredients(names, source);
    },
    onSuccess: () => {
      // Invalidate ingredients query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useGetAllIngredients() {
  const { actor, isFetching } = useActor();

  return useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIngredients();
    },
    enabled: !!actor && !isFetching,
  });
}

// Recipe queries
export function useSaveRecipe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipe: Recipe) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveRecipe(recipe);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useToggleFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleFavorite(recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useGetFavoriteRecipes() {
  const { actor, isFetching } = useActor();

  return useQuery<Recipe[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavoriteRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRecipes() {
  const { actor, isFetching } = useActor();

  return useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

// AI-powered queries
export function useAnalyzeIngredients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredientList: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      const recipes = await actor.analyzeIngredients(ingredientList);
      
      // Save all generated recipes to backend
      for (const recipe of recipes) {
        await actor.saveRecipe(recipe);
      }
      
      return recipes;
    },
    onSuccess: (recipes) => {
      // Store generated recipes in cache
      queryClient.setQueryData(['generated-recipes'], recipes);
      queryClient.setQueryData(['recipes'], recipes);
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function usePhotoToIngredients() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (image: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.photoToIngredients(image);
    },
  });
}

export function useStorageTips() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (ingredientList: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.storageTips(ingredientList);
    },
  });
}

export function useSafetyCheck() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (ingredientList: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.safetyCheck(ingredientList);
    },
  });
}

// History queries
export function useAddHistoryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredientList: Ingredient[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addHistoryEntry(ingredientList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useGetHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<HistoryEntry[]>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}
