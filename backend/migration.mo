import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Int "mo:base/Int";

module {
  // Old types
  type OldIngredient = {
    id : Text;
    name : Text;
    dateAdded : Int;
    source : Text;
  };

  type OldRecipe = {
    id : Text;
    title : Text;
    ingredientsUsed : [Text];
    missingIngredients : [Text];
    steps : [Text];
    prepTime : Nat;
    difficulty : Text;
    saved : Bool;
  };

  type OldHistoryEntry = {
    id : Text;
    ingredientList : [OldIngredient];
    timestamp : Int;
  };

  type OldActor = {
    ingredients : OrderedMap.Map<Text, OldIngredient>;
    recipes : OrderedMap.Map<Text, OldRecipe>;
    history : OrderedMap.Map<Text, OldHistoryEntry>;
  };

  // New types (same as old)
  type NewIngredient = OldIngredient;
  type NewRecipe = OldRecipe;
  type NewHistoryEntry = OldHistoryEntry;

  type NewActor = {
    ingredients : OrderedMap.Map<Text, NewIngredient>;
    recipes : OrderedMap.Map<Text, NewRecipe>;
    history : OrderedMap.Map<Text, NewHistoryEntry>;
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    {
      ingredients = old.ingredients;
      recipes = old.recipes;
      history = old.history;
    };
  };
};
