<template>
  <li class="order__item">

    <div class="product">
      <img
        src="@/assets/img/product.svg"
        class="product__img"
        width="56"
        height="56"
        :alt="pizza.name"
      >
      <div class="product__text">
        <h2>{{ pizza.name }}</h2>
        <ul>
          <li>{{ sizeOfPizza }}, <span class="product__ingredient-span">{{ typeOfDough }}</span> тесто.</li>
          <li>Соус: <span class="product__ingredient-span">{{ typeOfSauce }}.</span></li>
          <li>
            Начинка:
            <span
              v-for="ing in ings"
              :key="ing.index"
              class="product__ingredient-span product__ingredient-span_pseudo"
            >
              {{ ing }}
            </span></li>
        </ul>
      </div>
    </div>

    <p class="order__price">{{ pricePizza }} ₽</p>
  </li>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: "OrderPizzaItem",
  props: {
    pizza: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState("Builder", ['sizes', 'doughs', 'sauces', 'ingredients']),

    sizeOfPizza: function() {
      return this.sizes.find(({ id }) => this.pizza.sizeId === id)?.name;
    },

    typeOfDough: function() {
      return  this.doughs.find(({ id }) => this.pizza.doughId === id)?.name;
    },

    typeOfSauce: function() {
      return this.sauces.find(({ id }) => this.pizza.sauceId === id)?.name;
    },

    ings: function() {
      const ings =  this.pizza.ingredients.map( element =>
        this.ingredients.find( ingredient => ingredient.id === element.ingredientId)?.name);
      return ings;
    },

    pricePizza: function() {
      let ingredientsPriceSum = 0;

      this.pizza.ingredients.forEach( ingredient => {
        let price = this.ingredients.find( ing => ing.id === ingredient.ingredientId)?.price;
        let count = ingredient.quantity;
        ingredientsPriceSum += parseInt(price * count);
      });

      return ((this.sauces.find(({ id }) => this.pizza.sauceId === id)?.price
        + this.doughs.find(({ id }) => this.pizza.doughId === id)?.price
        + ingredientsPriceSum) * this.sizes.find(({ id }) => this.pizza.sizeId === id)?.multiplier);
    }
  },
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixins/mixins.scss";
@import "~@/assets/scss/ds-system/ds.scss";

.product {
  display: flex;
  align-items: center;
}

.product__text {
  margin-left: 15px;

  h2 {
    @include b-s18-h21;

    margin-top: 0;
    margin-bottom: 10px;
  }

  ul {
    @include clear-list;
    @include l-s11-h13;
  }
}

.order__item {
  display: flex;

  width: 310px;
  margin-right: 33px;
  margin-bottom: 32px;
}

.order__price {
  @include b-s16-h19;

  margin: 0;

  white-space: nowrap;
}

.product__ingredient-span {
  text-transform: lowercase;
}
.product__ingredient-span_pseudo {
  &::after {
    content: ", ";
  }

  &:last-child::after {
    content: ".";
  }
}
</style>
