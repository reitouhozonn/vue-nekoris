<script lang="ts" setup>

import { reactive } from 'vue';
import { Tetromino, TETROMINO_TYPE} from "../common/Tetromino";
import {Field} from '../common/Field';

let staticField = new Field();
const tetris = reactive({
  field: new Field(),
});

const tetromino = reactive({
  current: Tetromino.random(),
  position: {x:3, y:0},
});

const classBlockColor = (_x: number, _y: number): string => {
  const type = tetris.field.data[_y][_x];
  if (type > 0) {
    return Tetromino.id(type as TETROMINO_TYPE);
  }

  const {x, y} = tetromino.position;
  const { data } = tetromino.current;

  if (y <= _y && _y < y + data.length) {
    const cols = data[_y - y];
    if(x <= _x && _x < x + cols.length){
      if (cols[_x - x] > 0) {
        return Tetromino.id(cols[_x - x] as TETROMINO_TYPE);
      }
    }
  }
  return "";
};

const updateTime = 500;

setInterval(() => {
  tetris.field = Field.deepCopy(staticField);

  tetromino.position.y++;
  tetris.field.update(tetromino.current.data, tetromino.position);
}, 1 * updateTime);

tetris.field.update(tetromino.current.data, tetromino.position);

</script>

<template>
  <div>
    <h1>play screen</h1>
    <h2>user-name: {{ $route.query.name }}</h2>
  </div>

  <div class="container">
    <table class="field" style="border-collapse: collapse">
      <tr
        v-for="(row, y) in tetris.field.data"
        :key="y">
        <td
          class="block"
          v-for="(col, x) in row"
          :key="(x)"
          v-bind:class="classBlockColor(x,y)"
        ></td>
      </tr>
    </table>
  </div>
</template>


<style lang="scss" scoped>

.container{
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.field {
  border: ridge 0.4em #2c3e50;
  border-top: none;
}

.block {
  width: 1.3em;
  height: 1.3em;
  border: 0.1px solid #95a5a6;
  &-i {
    background: #3498db;
  }
  &-o {
    background: #f1c40f;
  }
  &-t {
    background: #9b59b6;
  }
  &-j {
    background: #1e3799;
  }
  &-l {
    background: #e67e22;
  }
  &-s {
    background: #2ecc71;
  }
  &-z {
    background: #e74c3c;
  }
}
</style>
