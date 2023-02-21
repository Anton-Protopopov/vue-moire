<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> {{ countProducts }} товара </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :filter-color.sync="productFilterColor"
        :filter-materials.sync ="productFilterMaterials"
        :filter-collections.sync ="productFilterCollections"
        :per-page.sync ="perPage"
      />

      <section class="catalog">

        <div class="loader" v-if="productLoading">
        <p class="loader-text"></p>
        </div>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров
        <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>

        <ProductList :products="products"/>
        <BasePaginition v-model="page" :count="countProducts" :per-page="perPage" />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePaginition from '@/components/BasePaginition.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePaginition, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      page: 1,
      perPage: 3,
      productFilterColor: [],
      productFilterMaterials: [],
      productFilterCollections: [],

      productsData: null,

      productLoading: false,

      productsLoadingFailed: false,
    };
  },
  computed: {

    products() {
      return this.productsData
        ? this.productsData.items
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productLoading = true;
      this.productsLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          page: this.page,
          limit: this.perPage,
          categoryId: this.filterCategoryId,
          minPrice: this.filterPriceFrom,
          maxPrice: this.filterPriceTo,
          materialIds: this.productFilterMaterials,
          colorIds: this.productFilterColor,
          seasonIds: this.productFilterCollections,
        },
      })
        .then((response) => { this.productsData = response.data; })
        .catch(() => { this.productsLoadingFailed = true; })
        .then(() => { this.productLoading = false; });
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    perPage() {
      this.loadProducts();
    },
    productFilterColor() {
      this.loadProducts();
    },
    productFilterMaterials() {
      this.loadProducts();
    },
    productFilterCollections() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
