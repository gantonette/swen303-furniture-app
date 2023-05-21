import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRadio, IonRadioGroup, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { arrowRedoOutline, cart, cartOutline, chevronBackOutline, heart, heartOutline} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router"
import ProductCard from "../components/ProductCard";
import { addToCart, CartStore } from "../data/CartStore";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./Product.module.css";

const Product = () => {
    const params = useParams();
    const cartRef = useRef();
    const products = ProductStore.useState((s) => s.products);
    const favourites = FavouritesStore.useState((s) => s.product_ids);
    const [isFavourite, setIsFavourite] = useState(false);
    const shopCart = CartStore.useState((s) => s.product_ids);
    const [product, setProduct] = useState({});
    const [category, setCategory] = useState({});

    useEffect(() => {
        const categorySlug = params.slug;
        const productID = params.id;
        const tempCategory = products.filter((p) => p.slug === categorySlug)[0];
        const tempProduct = tempCategory.products.filter(
            (p) => parseInt(p.id) === parseInt(productID)
        )[0];

        const tempIsFavourite = favourites.find(
            (f) => f === `${categorySlug}/${productID}`
        );

        setIsFavourite(tempIsFavourite);
        setCategory(tempCategory);
        setProduct(tempProduct);
    }, [params.slug, params.id]);

    useEffect(() => {
        const tempIsFavourite = favourites.find(
            (f) => f === `${category.slug}/${product.id}`
        );
        setIsFavourite(tempIsFavourite ? true : false);
    }, [favourites, product]);

    const addProductToFavourites = (e, categorySlug, productID) => {
        e.preventDefault();
        addToFavourites(categorySlug, productID);

        document.getElementById(
            `placeholder_favourite_product_${categorySlug}_${productID}`
        ).style.display = "";
        document
            .getElementById(
                `placeholder_favourite_product_${categorySlug}_${productID}`
            )
            .classList.add("animate__fadeOutTopRight");
    };

    const addProductToCart = (e, categorySlug, productID) => {
        e.preventDefault();

        document.getElementById(`placeholder_cart_${categorySlug}_${productID}`)
            .style.display = "";
        document
            .getElementById(`placeholder_cart_${categorySlug}_${productID}`)
            .classList.add("animate__fadeOutUp");

        setTimeout(() => {
            cartRef.current.classList.add("animate__tada");
            addToCart(categorySlug, productID);

            setTimeout(() => {
                cartRef.current.classList.remove("animate__tada");
            }, 500);
        }, 500);
    };

    // for the state of the product specifications
    const [specificationsVisible, setSpecificationsVisible] = useState(false);
    


    return (
        <IonPage id="category-page" className={styles.categoryPage}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton
                            color="dark"
                            text={category.name}
                            routerLink={`/category/${category.slug}`}
                            routerDirection="back"
                        >
                            <IonIcon
                                color="dark"
                                icon={chevronBackOutline}
                            />
                            &nbsp;{category.name}
                        </IonButton>
                    </IonButtons>

                    <IonTitle style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        View Product
                    </IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark" style={{ fontSize: "1.2rem" }}>
                            {shopCart.length}
                        </IonBadge>
                        <IonButton color="black" routerLink="/cart">
                            <IonIcon
                                ref={cartRef}
                                className="animate__animated"
                                icon={cart}
                                style={{ fontSize: "1.8rem" }}
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <IonCard
                                className={styles.categoryCard}
                                style={{ fontSize: "1.2rem" }}
                            >
                                <IonCardHeader
                                    className={styles.productCardHeader}
                                >
                                    <div
                                        className={styles.productCardActions}
                                    >
                                        <IonIcon
                                            className={styles.productCardAction}
                                            color={isFavourite ? "danger" : "medium"}
                                            icon={isFavourite ? heart : heartOutline}
                                            onClick={(e) =>
                                                addProductToFavourites(
                                                    e,
                                                    category.slug,
                                                    product.id
                                                )
                                            }
                                            style={{
                                                fontSize: "1.8rem",
                                                marginRight: "0.5rem",
                                            }}
                                        />
                                        <IonIcon
                                            style={{
                                                position: "absolute",
                                                display: "none",
                                            }}
                                            id={`placeholder_favourite_product_${category.slug}_${product.id}`}
                                            className={`${styles.productCardAction} animate__animated`}
                                            color="danger"
                                            icon={heart}
                                        />
                                        <IonIcon
                                            className={styles.productCardAction}
                                            size="medium"
                                            icon={arrowRedoOutline}
                                            style={{
                                                fontSize: "1.8rem",
                                            }}
                                        />
                                    </div>
                                    <img
                                        src={product.image}
                                        alt="product pic"
                                        style={{ width: "75%" }}
                                    />
                                    <h1 className="ion-text-wrap" style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                                        {product.name} 
                                    </h1>
                                    
                                    <p className="ion-text-wrap" style={{ fontSize: "1rem" }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin risus in eivamus eu efficitur sem. Sed vestibulum turpiLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin risus in elit volutpat, non rhoncus arcu iaculis.
                                    </p>
                                    <h1>
                                        Specifications:
                                        <IonButton
                                            fill="clear"
                                            size="small"
                                            onClick={() => setSpecificationsVisible(!specificationsVisible)}
                                        >
                                            {specificationsVisible ? "hide" : "show"}
                                        </IonButton>
                                    </h1>
                                        {specificationsVisible && (
                                            <IonCardContent>
                                                <p
                                                className="ion-text-wrap"
                                                style={{ fontSize: "1rem" }}
                                                >
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin risus in elit volutpat, non rhoncus arcu iaculis. Nullam varius, arcu at vulputate fermentum, tellus arcu rutrum magna, a semper est neque ac massa. In auctor nisl mauris, at laoreet urna auctor vitae. Morbi facilisis mauris ac hendrerit vestibulum. Duis ac eros id mi ullamcorper elementum. Fusce efficitur nisi at est vestibulum pellentesque. Sed vitae semper urna, at varius tellus. Aliquam ultrices scelerisque magna, eu pulvinar nibh lacinia sit amet. Ut quis est dui. Nunc consequat, turpis sit amet venenatis varius, elit erat dapibus urna, eu efficitur tortor odio vitae tellus. Vivamus eu efficitur sem. Sed vestibulum turpi
                                                </p>
                                            </IonCardContent>
                                        )}

                                       
                                </IonCardHeader>

                                <IonCardContent
                                    className={styles.categoryCardContent}
                                >
                                    <div className={styles.productPrice}>
                                        <IonButton
                                            color="dark"
                                            size="large"
                                            style={{
                                                fontSize: "1.4rem",
                                                fontWeight: "bold",
                                                padding: "0.8rem",
                                            }}
                                        >
                                            {product.price}
                                        </IonButton>

                                        <IonButton
                                            size="large"
                                            color="dark"
                                            onClick={(e) =>
                                                addProductToCart(
                                                    e,
                                                    category.slug,
                                                    product.id
                                                )
                                            }
                                            style={{
                                                fontSize: "1.4rem",
                                                fontWeight: "bold",
                                                padding: "0.8rem",
                                                marginLeft: "1rem",
                                            }}
                                        >
                                            <IonIcon
                                                icon={cartOutline}
                                                style={{
                                                    fontSize: "1.4rem",
                                                    marginRight: "0.5rem",
                                                }}
                                            />
                                            {/* &nbsp;&nbsp; Cart */}
                                        </IonButton>

                                        <IonIcon
                                            icon={cart}
                                            color="dark"
                                            style={{
                                                position: "absolute",
                                                display: "none",
                                                fontSize: "3rem",
                                            }}
                                            id={`placeholder_cart_${category.slug}_${product.id}`}
                                            className="animate__animated"
                                        />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonCardSubtitle
                                style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Similar products...
                            </IonCardSubtitle>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        {category &&
                            category.products &&
                            category.products.map((similar, index) => {
                                if (
                                    similar.id !== product.id &&
                                    product.image &&
                                    index < 4
                                ) {
                                    return (
                                        <ProductCard
                                            key={`similar_product_${index}`}
                                            product={similar}
                                            index={index}
                                            isFavourite={false}
                                            cartRef={cartRef}
                                            category={category}
                                        />
                                    );
                                }
                            })}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Product;

