<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price" for="name">
          <input
            class="form__input"
            type="number"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price" for="name">
          <input class="form__input" type="number"
           name="max-price" v-model.number="currentPriceTo" />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select" for="name">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="undefined">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label" :for="color.name">
              <input
                class="colors__radio sr-only"
                :id="color.id"
                type="checkbox"
                :value="color.id"
                v-model="currentFilterColor"
              />
              <span class="colors__value" v-bind:style="{ 'background-color': color.code }"> </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label" :for="material.name">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                :value="material.id"
                v-model="currentFilterMaterials"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="collection in collections" :key="collection.id">
            <label class="check-list__label" :for="collection.name">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                :value="collection.id"
                v-model="currentFilterCollections"
              />
              <span class="check-list__desc">
                {{ collection.title }}
                <span>({{ collection.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>
      <fieldset class="form__block">
        <legend class="form__legend"> Количество товаров на странице</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="per in perPageArr" :key="per.index">
            <label class="check-list__label" :for="per.name">
              <input
                class="check-list__check sr-only"
                type="radio"
                :value="per"
                v-model="currentPerPage"
              />
              <span class="check-list__desc">
                {{ per }}
                <span>товаров</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">Применить</button>
      <button class="filter__reset button button--second" type="button" @click.prevent="reset"
      :class="{'none': resetButtom}">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import { API_BASE_URL } from '@/config';
import axios from 'axios';

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: this.$route.params.data,
      currentPerPage: 3,
      currentFilterColor: [],
      currentFilterMaterials: [],
      currentFilterCollections: [],
      perPageArr: [9, 18, 27],

      categoriesData: null,
      colorsData: null,
      materialsData: null,
      collectionsData: null,
    };
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'filterColor',
    'filterMaterials',
    'filterCollections',
    'perPage',
  ],
  computed: {
    resetButtom() {
      if (this.priceFrom === 0
       && this.priceTo === 0
       && this.categoryId === undefined
       && this.perPage < 8
       && this.filterColor.length === 0
       && this.filterMaterials.length === 0
       && this.filterCollections.length === 0) {
        return true;
      }
      return false;
    },
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    collections() {
      return this.collectionsData ? this.collectionsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    perPage(value) {
      this.currentPerPage = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    filterColor(value) {
      this.currentFilterColor = value;
    },
    filterMaterials(value) {
      this.currentFilterMaterials = value;
    },
    filterCollections(value) {
      this.currentFilterCollections = value;
    },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:filterColor', this.currentFilterColor);
      this.$emit('update:filterMaterials', this.currentFilterMaterials);
      this.$emit('update:filterCollections', this.currentFilterCollections);
      this.$emit('update:perPage', this.currentPerPage);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', undefined);
      this.$emit('update:filterColor', []);
      this.$emit('update:filterMaterials', []);
      this.$emit('update:filterCollections', []);
      this.$emit('update:perPage', 3);
    },
    loadCategories() {
      axios.get(`${API_BASE_URL}/api/productCategories`).then((response) => {
        this.categoriesData = response.data;
      });
    },
    loadColors() {
      axios.get(`${API_BASE_URL}/api/colors`).then((response) => {
        this.colorsData = response.data;
      });
    },
    loadMaterials() {
      axios.get(`${API_BASE_URL}/api/materials`).then((response) => {
        this.materialsData = response.data;
      });
    },
    loadCollections() {
      axios.get(`${API_BASE_URL}/api/seasons`).then((response) => {
        this.collectionsData = response.data;
      });
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadCollections();
  },
};
</script>
