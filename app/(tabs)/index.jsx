import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { MealAPI } from '../../services/mealAPI';

const HomeScreen = () => {
  const router =   useRouter();
  const [selectedCategory,setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecip, setFeaturedRecip] = useState(null);
  const [loading, setLoadaing] = useState(true);
  const [rfreshing, setRefreshing] = useState(false);

  const loadData = async()  => {
    try {
      setLoadaing(true);
      const [apiCategories, randomMeals, featureMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        Image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

        setRecipes(transformedMeals);

        const transformedFeatured = MealAPI.transformMealData(featuredMeal);
        setFeaturedRecip(transformedFeatured);
    } catch (error) {
      console.log("Error loading the data", error)
    } finally {
      setLoadaing(false);
    }
  }
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen