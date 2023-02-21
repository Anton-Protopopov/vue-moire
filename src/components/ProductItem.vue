<template>
  <li class="catalog__item">
    <router-link  class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img
        :src="itemImage"
        :alt="product.title"
    /></router-link>
    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>
    <span class="catalog__price"> {{ product.price | namberFormat }} ₽ </span>
    <ul class="colors colors--black">
      <li class="colors__item" v-for="colors in product.colors" :key="colors.id">
        <label class="colors__label"  :for="colors.name">
          <input
            class="colors__radio sr-only"
            :id="colors.color.id"
            type="radio"
            :value="colors.color.id"
             v-model="color"
          />
          <span class="colors__value"
           v-bind:style="{ 'background-color': colors.color.code }"> </span>
        </label>
      </li>
    </ul>
    <button class="button button--primery" type="button"
    @click.prevent="addToCart">В корзину</button>
  </li>
</template>
<script>
import gotoPage from '@/helpers/gotopage';
import namberFormat from '@/helpers/namberFormat';
import { mapActions } from 'vuex';
import { API_BASE_URL } from '@/config';
import axios from 'axios';

export default {
  filters: {
    namberFormat,
  },
  data() {
    return {
      color: this.product.colors[0].color.id,
      image: this.product.colors[0].gallery[0].file.url,
    };
  },
  computed: {
    itemImage() {
      const col = this.color;
      const arr = this.product.colors.filter((el) => el.color.id === col);
      const url = arr.map((el) => el.gallery.map((elem) => elem.file.url));
      return url;
    },
  },
  methods: {
    gotoPage,
    ...mapActions(['addProductToCart']),
    addToCart() {
      axios.get(`${API_BASE_URL}/api/products/${this.product.id}`)
        .then((response) => {
          const size = response.data.sizes[0].id;
          this.addProductToCart({
            productId: this.product.id,
            amount: 1,
            colorId: this.color,
            sizeId: size,
          });
        });
    },
  },
  props: ['product'],
};
</script>
