/* eslint-disable max-len */
/* eslint-disable consistent-return */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductData: [],

    productsLoadingFailed: false,
    productLoading: true,

    orderInfo: null,
  },
  mutations: {
    updeateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((items) => items.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    addCartProductAmount(state, basketItemId) {
      const item = state.cartProducts.find((items) => items.id === basketItemId);

      if (item) {
        item.amount += 1;
      }
    },
    decreaseCartProductAmount(state, basketItemId) {
      const item = state.cartProducts.find((items) => items.id === basketItemId);

      if (item) {
        item.amount -= 1;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUseAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductData(state, items) {
      state.cartProductData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
        colors: item.color,
        id: item.id,
      }));
    },
    updateProductsLoadingFailed(state) {
      state.productsLoadingFailed = true;
    },
    updateProductLoading(state) {
      state.productLoading = false;
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductData.find((p) => p.product.id === item.productId);

        return {
          ...item,
          product: {
            ...product,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderInfo) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderInfo}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updeateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      this.productsLoadingFailed = false;
      this.productLoading = true;
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUseAccessKey', response.data.user.accessKey);
          }

          context.commit('updateCartProductData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => { context.commit('updateProductsLoadingFailed'); })
        .then(() => { context.commit('updateProductLoading'); });
    },
    addProductToCart(context, {
      productId, amount, colorId, sizeId,
    }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
          colorId,
          sizeId,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, { basketItemId, amount }) {
      context.commit('updateCartProductAmount', { basketItemId, amount });

      if (amount < 1) {
        return;
      }

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    addCartProductAmount(context, { basketItemId, amount }) {
      context.commit('addCartProductAmount', basketItemId);

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount + 1,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    decreaseCartProductAmount(context, { basketItemId, amount }) {
      context.commit('decreaseCartProductAmount', basketItemId);

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount - 1,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, basketItemId) {
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: { basketItemId },
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
  },
});
