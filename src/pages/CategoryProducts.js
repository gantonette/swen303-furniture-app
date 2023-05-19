import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar, IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { cart, chevronBackOutline, searchOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router"
import ProductCard from "../components/ProductCard";

import { CartStore } from "../data/CartStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./CategoryProducts.module.css";

const CategoryProducts = () => {
  const params = useParams();
  const cartRef = useRef();
  const products = ProductStore.useState((s) => s.products);
  const shopCart = CartStore.useState((s) => s.product_ids);
  const [category, setCategory] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [amountLoaded, setAmountLoaded] = useState(6);
  const [priceFilter, setPriceFilter] = useState(""); // New state for price filter

  useEffect(() => {
    const categorySlug = params.slug;
    const tempCategory = products.find((p) => p.slug === categorySlug);
    setCategory(tempCategory);
    setSearchResults(tempCategory.products);
  }, [params.slug, products]);

  const fetchMore = (e) => {
    setAmountLoaded((prevAmount) => prevAmount + 6);
    e.target.complete();
  };

  const search = (e) => {
    const searchVal = e.target.value.toLowerCase();

    if (searchVal !== "") {
      const tempResults = category.products.filter((p) =>
        p.name.toLowerCase().includes(searchVal)
      );
      setSearchResults(tempResults);
    } else {
      setSearchResults(category.products);
    }
  };

  const applyPriceFilter = () => {
    let filteredResults = [...searchResults]; // Create a copy of searchResults
  
    if (priceFilter === "low") {
      filteredResults.sort((a, b) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)));
    } else if (priceFilter === "high") {
      filteredResults.sort((a, b) => parseFloat(b.price.substring(1)) - parseFloat(a.price.substring(1)));
    }
    console.log(filteredResults);
    setSearchResults(filteredResults);
  };

  return (
    <IonPage id="category-page" className={styles.categoryPage}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="dark"
              text={category.name}
              routerLink="/"
              routerDirection="back"
            >
              <IonIcon color="dark" icon={chevronBackOutline} />
              &nbsp;Categories
            </IonButton>
          </IonButtons>
          <IonTitle>{category && category.name}</IonTitle>

          <IonButtons slot="end">
            <IonBadge color="dark">{shopCart.length}</IonBadge>
            <IonButton color="dark" routerLink="/cart">
              <IonIcon
                ref={cartRef}
                className="animate__animated"
                icon={cart}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          className={styles.search}
          onKeyUp={search}
          placeholder="Try 'high back'"
          searchIcon={searchOutline}
          animated={true}
        />

        {/* Price Filter Dropdown */}
        <IonGrid className={styles.priceFilterGrid}>
          <IonRow>
            <IonCol>
              <IonSelect value={priceFilter} placeholder="Sort by Price" onIonChange={(e) => setPriceFilter(e.target.value)}>
                <IonSelectOption value="low">Lowest Price</IonSelectOption>
                <IonSelectOption value="high">Highest Price</IonSelectOption>
              </IonSelect>
              <IonButton className={styles.priceFilterButton} color="primary" expand="full" onClick={applyPriceFilter}>
                Apply
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol size="12">
              <IonNote>
                {searchResults && searchResults.length}{" "}
                {searchResults.length !== 1 ? "products" : "product"} found
              </IonNote>
            </IonCol>
          </IonRow>

          <IonRow>
          {searchResults &&
  searchResults
    .slice(0, amountLoaded)
    .map((product, index) => (
      <ProductCard
        key={`category_product_${index}`}
        product={product}
        index={index}
        cartRef={cartRef}
        category={category}
      />
    ))}
          </IonRow>
        </IonGrid>

        <IonInfiniteScroll threshold="100px" onIonInfinite={fetchMore}>
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Fetching more..."
          />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default CategoryProducts;
