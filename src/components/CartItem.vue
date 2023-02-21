<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="itemImage" width="120" height="120" :alt="item.product.title" />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info product__info--color">
                Цвет:
                <span>
                  <i v-bind:style="{ 'background-color': item.colors.color.code }"></i>
                  {{ item.colors.color.title }}
                </span>
              </p>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар"
      @click.prevent="decreaseProduct(item.id, item.amount)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count" />

      <button type="button" aria-label="Добавить один товар"
      @click.prevent="addProduct">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price"> {{ (item.amount * item.product.price) | namberFormat }} ₽ </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
    @click.prevent="deleteProduct(item.id)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import namberFormat from '@/helpers/namberFormat';
import { mapActions } from 'vuex';

export default {
  filters: { namberFormat },
  props: ['item'],
  computed: {
    itemImage() {
      return this.item.colors.gallery.map((el) => el.file.url);
    },
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        return this.$store.dispatch(
          'updateCartProductAmount',
          { productId: this.item.productId, amount: value },
        );
      },
    },
    addProduct() {
      return this.$store.dispatch(
        'addCartProductAmount',
        { basketItemId: this.item.id, amount: this.item.amount },
      );
    },
    decreaseProduct() {
      return this.$store.dispatch(
        'decreaseCartProductAmount',
        { basketItemId: this.item.id, amount: this.item.amount },
      );
    },
  },
  methods: {
    ...mapActions({ deleteProduct: 'deleteCartProduct' }),
  },
};
</script>
