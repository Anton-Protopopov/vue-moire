<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vue/no-multiple-template-root -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <main class="content container loader" v-if="productLoading"><p class="loader-text"></p></main>
  <main class="content container" v-else-if="!productData">
    Произошла ошибка при загрузке товара</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}"> Каталог</router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="({name: 'main',
           params: { data: category.id }})"
           > {{category.title}} </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{product.category.title}} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="itemImage"
            :alt="product.title"
          />
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="colors in product.colors" :key="colors.color.id">
              <img width="98"
              v-for="gallery in colors.gallery" :key="gallery.file.name"
                height="98"
                :src="gallery.file.url"
                :alt="product.title">
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.id}}</span>
        <h2 class="item__title">{{product.category.title}}</h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар"
                :class="{'pagination__link--disabled'
            : productAmount === 1}"
                @click="productAmountBack">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="number" v-model.number="productAmount"/>

                <button type="button" aria-label="Добавить один товар"
                @click="productAmountNext">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>
            <b class="item__price"> {{product.price | namberFormat}} ₽ </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors colors--black">
                <li class="colors__item" v-for="colors in product.colors" :key="colors.color.id">
                  <label class="colors__label" :for="colors.name">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      :id="colors.color.id"
                      :value="colors.color.id"
                      v-model="color"
                    />
                    <span class="colors__value"
                    :style="{'background-color': colors.color.code}"> </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select" for="name">
                  <select class="form__select" type="text" v-model="size">
                    <option :value="sizes.id"
                     v-for="sizes in product.sizes" :key="sizes.id"
                    >{{ sizes.title }}</option>
                  </select>
                </label>
              </fieldset>

              <button class="button button--primery" type="submit"
               :disabled="productAddSending">В корзину</button>
            </div>
            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар в корзину...</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br>
            30% полиэстер<br>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import gotoPage from '@/helpers/gotopage';
import namberFormat from '@/helpers/namberFormat';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      productAmount: 1,
      color: '',
      size: '',
      productData: null,
      productLoading: true,
      productLoadingFailed: false,

      productAdded: false,
      productAddSending: false,
    };
  },
  filters: {
    namberFormat,
  },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    itemImage() {
      const col = this.color;
      const arr = this.productData.colors.filter((el) => el.color.id === col);
      const url = arr.map((el) => el.gallery.map((elem) => elem.file.url));
      return url;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    gotoPage,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;

      this.addProductToCart({
        productId: this.product.id,
        amount: this.productAmount,
        colorId: this.color,
        sizeId: this.size,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
    },
    productAmountNext() {
      this.productAmount += 1;
    },
    productAmountBack() {
      this.productAmount -= 1;
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => {
          this.productData = response.data;
          this.color = response.data.colors[0].color.id;
          this.size = response.data.sizes[0].id;
        })
        .catch(() => { this.productLoadingFailed = true; })
        .then(() => { this.productLoading = false; });
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>
