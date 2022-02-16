<script lang="ts" setup>

import { reactive, onMounted, onBeforeUnmount } from 'vue';
import { Tetromino, TETROMINO_TYPE } from "../common/Tetromino";
import { Field } from '../common/Field';
// import func from '../../vue-temp/vue-editor-bridge';

import TetrominoPreviewComponent from '../components/TetrominoPreviewComponent.vue';

let staticField = new Field();
const tetris = reactive({
  field: new Field(),
});

const tetromino = reactive({
  current: Tetromino.random(),
  position: { x: 3, y: 0 },
  next: Tetromino.random(),
});

const classBlockColor = (_x: number, _y: number): string => {
  const type = tetris.field.data[_y][_x];
  if (type > 0) {
    return Tetromino.id(type as TETROMINO_TYPE);
  }

  const { x, y } = tetromino.position;
  const { data } = tetromino.current;

  if (y <= _y && _y < y + data.length) {
    const cols = data[_y - y];
    if (x <= _x && _x < x + cols.length) {
      if (cols[_x - x] > 0) {
        return Tetromino.id(cols[_x - x] as TETROMINO_TYPE);
      }
    }
  }
  return "";
};

const canDropCurrentTetromino = (): Boolean => {
  const { x, y } = tetromino.position;
  const droppedPosition = { x, y: y + 1 };

  const data = tetromino.current.data;
  return tetris.field.canMove(data, droppedPosition);
}

const nextTetrisField = () => {
  const data = tetromino.current.data;
  const position = tetromino.position;

  tetris.field.update(data, position);

  staticField = new Field(tetris.field.data);
  tetris.field = Field.deepCopy(staticField);

  tetromino.current = tetromino.next;
  tetromino.next = Tetromino.random();
  tetromino.position = { x: 3, y: 0 };
}


const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Down":
    case "ArrowDown":
      if (canDropCurrentTetromino()) {
        tetromino.position.y++;
        resetDrop();
      } else {
        nextTetrisField();
      }
      break;
  }
}

onMounted(function () {
  document.addEventListener('keydown', onKeyDown);
});
onBeforeUnmount(function () {
  document.removeEventListener('keydown', onKeyDown);
});



const dropTime = 500;

const resetDropInterval = () => {
  let interval = -1;

  return () => {
    if (interval !== -1) clearInterval(interval);
    interval = setInterval(() => {
      tetris.field = Field.deepCopy(staticField);

      if (canDropCurrentTetromino()) {
        tetromino.position.y++;
      } else {
        nextTetrisField();
      }
    }, 1 * dropTime);
  }
}

// tetris.field.update(tetromino.current.data, tetromino.position);
const resetDrop = resetDropInterval();
resetDrop();

</script>

<template>
  <div>
    <h1>play screen</h1>
    <h2>user-name: {{ $route.query.name }}</h2>
  </div>

  <div class="container">
    <div class="tetris">
      <table class="field" style="border-collapse: collapse">
        <tr v-for="(row, y) in tetris.field.data" :key="y">
          <td class="block" v-for="(col, x) in row" :key="(x)" v-bind:class="classBlockColor(x, y)"></td>
        </tr>
      </table>
    </div>
    <div class="information">
      <TetrominoPreviewComponent v-bind:tetromino="tetromino.next.data" />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.container {
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

.information {
  margin-left: 1em;
}
</style>
