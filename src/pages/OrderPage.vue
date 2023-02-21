<template>
     <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{$store.state.cartProducts.length}} товара
      </span>
    </div>

    <section class="cart">

      <form class="cart__form form" action="#" method="POST" @submit.prevent="order" >
        <div class="cart__field">
          <div class="loader" v-if="formLoading">
             <p class="loader-text"></p>
          </div>
          <div class="cart__data" v-else>
            <BaseFormText
             title="ФИО"
             :error="formError.name"
             placeholder="Введите ваше полное имя"
             v-model="formData.name"
             type="text"/>

             <BaseFormText
             title="Адрес доставки"
             :error="formError.address"
             placeholder="Введите ваш адрес"
             v-model="formData.address"
             type="text"/>

             <BaseFormText
             title="Телефон"
             :error="formError.phone"
             placeholder="Введите ваш телефон"
             v-model="formData.phone"
             type="tel"/>

             <BaseFormText
             title="Email"
             :error="formError.email"
             placeholder="Введи ваш Email"
             v-model="formData.email"
             type="email"/>

            <BaseFormTextarea
             title="Комментарий к заказу"
             :error="formError.comment"
             placeholder="Ваши пожелания"
             v-model="formData.comment"/>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveries" :key="delivery.id">
                <label class="options__label" :for="delivery.name">
                  <input class="options__radio sr-only"
                   type="radio"
                   :value="delivery.id"
                   v-model="formData.deliveryTypeId">
                  <span class="options__value">
                    {{ delivery.title }} <b>{{ delivery.price }}</b>
                  </span>
                </label>
                </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in payments" :key="payment.id">
                <label class="options__label" :for="payment.name">
                  <input class="options__radio sr-only"
                   type="radio"
                   :value="payment.id"
                   v-model="formData.paymentTypeId">
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in product" :key="item.productId">
              <h3>{{ item.product.title }}</h3>
              <b>{{ (item.amount * item.product.price) | namberFormat }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ itemPrice }} ₽</b></p>
            <p>Итого: <b>{{$store.state.cartProducts.length}}
            </b> товара на сумму <b>{{(totalPrice + itemPrice) | namberFormat}} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import namberFormat from '@/helpers/namberFormat';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  filters: { namberFormat },
  components: { BaseFormText, BaseFormTextarea },
  data() {
    return {
      formData: {
        deliveryTypeId: '',
        paymentTypeId: '',
      },
      formError: {},
      formErrorMessage: '',
      formLoading: false,
      deliveriesData: null,
      paymentsData: null,
    };
  },

  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.formLoading = true;
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.$store.commit('resetCart');
          this.$store.commit('updeateOrderInfo', response.data);
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message || '';
        })
        .then(() => { this.formLoading = false; });
    },
    loadDeliveries() {
      axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          this.deliveriesData = response.data;
          this.formData.deliveryTypeId = response.data[0].id;
        });
    },
    loadPayments() {
      axios.get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId: this.formData.deliveryTypeId,
        },
      }).then((response) => {
        this.paymentsData = response.data;
        this.formData.paymentTypeId = response.data[0].id;
      });
    },
  },
  watch: {
    paymentsId() {
      this.loadPayments();
    },
  },
  computed: {
    ...mapGetters({ product: 'cartDetailProducts', totalPrice: 'cartTotalPrice' }),
    deliveries() {
      return this.deliveriesData ? this.deliveriesData : [];
    },
    payments() {
      return this.paymentsData ? this.paymentsData : [];
    },
    paymentsId() {
      return this.formData.deliveryTypeId;
    },
    itemPrice() {
      const priceId = this.formData.deliveryTypeId;
      const priceObj = this.deliveriesData.filter((el) => el.id === priceId);
      return Number(priceObj.map((el) => el.price));
    },
  },
  created() {
    this.loadDeliveries();
  },
};
</script>
