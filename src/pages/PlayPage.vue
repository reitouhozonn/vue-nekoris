<script lang="ts" setup>

import { reactive, onBeforeUnmount, watch } from 'vue';
import { Tetromino, TETROMINO_TYPE } from "../common/Tetromino";
import { Level } from "../common/Level";
import { Field } from '../common/Field';

import TetrominoPreviewComponent from '../components/TetrominoPreviewComponent.vue';
import TetrominoNextPreviewComponent from '../components/TetrominoNextPreviewComponent.vue';

const PLAY_STATUS = {
  GAMESTART: 1,
  PLAYING: 2,
  GAMEOVER: 3,
} as const;
type PLAY_STATUS = typeof PLAY_STATUS[keyof typeof PLAY_STATUS];

const DIFFICULTY_TYPE = {
  EASY: 1000,
  NORMAL: 500,
  HARD: 250,
  MASTER: 100,
  EXTREME: 50,
} as const;
type DIFFICULTY_TYPE = typeof DIFFICULTY_TYPE;

let staticField = new Field();

const gameStatus = reactive({ gameStatus: PLAY_STATUS.GAMESTART as PLAY_STATUS });
const isStandby = () => gameStatus.gameStatus !== PLAY_STATUS.PLAYING;
const gameStart = () => gameStatus.gameStatus = PLAY_STATUS.PLAYING;

const tetris = reactive({
  field: new Field(),
  score: 0,
  level: "",
});

watch(gameStatus, (currentState) => {
  switch (currentState.gameStatus as PLAY_STATUS) {
    case PLAY_STATUS.GAMESTART:
      break;
    case PLAY_STATUS.PLAYING:
      document.addEventListener('keydown', onKeyDown);

      staticField = new Field();
      tetris.field = new Field();

      tetromino.current = Tetromino.random();
      tetromino.next = Tetromino.random();
      tetromino.nextNext = Tetromino.random();

      tetris.score = 0;
      resetDrop();

      break;
    case PLAY_STATUS.GAMEOVER:
      document.removeEventListener('keydown', onKeyDown);

      tetromino.next = Tetromino.empty();
      tetromino.nextNext = Tetromino.empty();
      break;
  }
})

const tetromino = reactive({
  current: Tetromino.empty(),
  position: { x: 3, y: 0 },
  rotate: 0,
  next: Tetromino.empty(),
  nextNext: Tetromino.empty(),
});

const currentTetrominoData = () => {
  return Tetromino.rotate(tetromino.rotate, tetromino.current.data);
}

const classBlockColor = (_x: number, _y: number): string => {
  const type = tetris.field.data[_y][_x];
  if (type > 0) {
    return Tetromino.id(type as TETROMINO_TYPE);
  }

  const { x, y } = tetromino.position;
  const data = currentTetrominoData();

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

  const data = currentTetrominoData();
  return tetris.field.canMove(data, droppedPosition);
}

const nextTetrisField = () => {
  const data = currentTetrominoData();
  const position = tetromino.position;

  tetris.field.update(data, position);
  const { field, score } = deleteLine();

  staticField = new Field(field);
  tetris.field = Field.deepCopy(staticField);
  tetris.score += score;



  tetromino.current = tetromino.next;
  tetromino.next = tetromino.nextNext;
  tetromino.nextNext = Tetromino.random();
  tetromino.rotate = 0;
  tetromino.position = { x: 3, y: 0 };

  if (!canDropCurrentTetromino()) {
    gameStatus.gameStatus = PLAY_STATUS.GAMEOVER as PLAY_STATUS;
    resetDrop(true);
  }
}


const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case " ": {
      const nextRotate = (tetromino.rotate + 1) % 4;
      const data = Tetromino.rotate(nextRotate, tetromino.current.data);
      if (tetris.field.canMove(data, tetromino.position)) {
        tetromino.rotate = nextRotate;
      }
    }
      break;
    case "Down":
    case "ArrowDown":
      if (canDropCurrentTetromino()) {
        tetromino.position.y++;
        resetDrop();
      } else {
        nextTetrisField();
      }
      break;
    case "Up":
    case "ArrowUp":
      while (canDropCurrentTetromino()) {
        tetromino.position.y++;
        resetDrop();
      }
      nextTetrisField();
      break;
    case "Left":
    case "ArrowLeft": {
      const data = currentTetrominoData();
      const { x, y } = tetromino.position;
      const leftPosition = { x: x - 1, y };
      if (tetris.field.canMove(data, leftPosition)) {
        tetromino.position.x--;
      }
    }
      break;
    case "Right":
    case "ArrowRight": {
      const data = currentTetrominoData();
      const { x, y } = tetromino.position;
      const rightPosition = { x: x + 1, y };
      if (tetris.field.canMove(data, rightPosition)) {
        tetromino.position.x++;
      }
    }
      break;
  }
}

const deleteLine = () => {
  let score = 0;
  const field = tetris.field.data.filter((row) => {
    if (row.every(col => col > 0)) {
      score++;
      return false;
    }
    return true;
  });
  for (let i = 0; i < score; i++) {
    field.unshift(new Array(field[0].length).fill(0));
  }
  return { score, field };
};


onBeforeUnmount(function () {
  document.removeEventListener('keydown', onKeyDown);
});

const getDropTime = () => {
  if (tetris.score >= 5) {
    tetris.level = Level.id(DIFFICULTY_TYPE.NORMAL);
    return DIFFICULTY_TYPE.NORMAL;
  }
  if (tetris.score >= 20) {
    tetris.level = Level.id(DIFFICULTY_TYPE.HARD);
    return DIFFICULTY_TYPE.HARD;
  }
  if (tetris.score >= 50) {
    tetris.level = Level.id(DIFFICULTY_TYPE.MASTER);
    return DIFFICULTY_TYPE.MASTER;
  }
  if (tetris.score >= 100) {
    tetris.level = Level.id(DIFFICULTY_TYPE.EXTREME);
    return DIFFICULTY_TYPE.EXTREME;
  }
  tetris.level = Level.id(DIFFICULTY_TYPE.EASY);
  return DIFFICULTY_TYPE.EASY;
}

const resetDropInterval = () => {
  let intervalId = -1;

  return (gameover: boolean = false) => {
    if (intervalId !== -1) clearInterval(intervalId);
    if (gameover) return;
    intervalId = setInterval(() => {
      tetris.field = Field.deepCopy(staticField);

      if (canDropCurrentTetromino()) {
        tetromino.position.y++;
      } else {
        nextTetrisField();
      }
    }, 1 * getDropTime());
  };
};

const resetDrop = resetDropInterval();

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
      <TetrominoNextPreviewComponent v-bind:tetromino="tetromino.nextNext.data" />
      <ul class="data">
        <li v-if="!isStandby()">レベル: {{ tetris.level }}</li>
        <li>スコア: {{ tetris.score }}</li>
        <li>
          <button v-if="isStandby()" @click.self.stop="gameStart">ゲームスタート</button>
        </li>
      </ul>
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
  position: relative;
  margin-left: 1em;

  ul.data {
    list-style: none;
    position: absolute;
    text-align: left;
    font-size: 1.3em;
    padding-left: 0;
    bottom: 0;
  }
}
</style>
