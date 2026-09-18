import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const ingredientData = useSelector((state) => state.ingredients.items);

  const id = window.location.pathname.split('/').pop();

  const ingredient = ingredientData.find((item) => item._id === id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
