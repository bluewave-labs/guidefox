# DefaultPageTemplate Component

The `DefaultPageTemplate` component is a reusable template for list pages that manage items like popups or banners. It handles fetching, displaying, and deleting items and is easily customizable by passing in the necessary props.

## Props

- **`getItems` (function, required):** Fetches the list of items.
- **`deleteItem` (function, required):** Deletes a selected item by ID.
- **`navigateToCreate` (function, required):** Handles navigation to the creation or editing page.
- **`itemType` (string, required):** Defines the type of item (e.g., "banners", "popups").
- **`itemTypeInfo` (object, required):** Provides additional details for the item type, such as title and description.
- **`getItemDetails` (function, required):** Extracts relevant details from each item for display.

## Example Usage

```jsx
import DefaultPageTemplate from '../../templates/DefaultPageTemplate/DefaultPageTemplate';
import { getBanners, deleteBanner } from '../../services/bannerServices';
import { ACTIVITY_TYPES_INFO } from '../../data/GuideMainPageData';
import { useNavigate } from 'react-router-dom';

const BannerDefaultPage = () => {
  const navigate = useNavigate();
  const getBannerDetails = (banner) => ({
    title: `Banner ${banner.id}`,
    text: banner.bannerText,
  });
  const navigateToCreate = (state) => {
    navigate('/banner/create', state);
  };

  return (
    <DefaultPageTemplate
      getItems={getBanners}
      deleteItem={deleteBanner}
      navigateToCreate={navigateToCreate}
      itemType={ACTIVITY_TYPES_INFO.BANNERS}
      itemTypeInfo={ACTIVITY_TYPES_INFO.BANNERS}
      getItemDetails={getBannerDetails}
    />
  );
};
```
