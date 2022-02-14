<script lang="ts" setup>

const row = 20;
const column = 10;

const field = new Array(row);

for (let i = 0; i < row; i++) {
  const fieldColumn = new Array(column).fill(0);
  field[i] = fieldColumn;
  }

  field[0][0] = 2;
  field[1][0] = 1;
  field[2][0] = 1;
  field[3][0] = 1;

  const classBlockColor = (x: number, y: number): string => {
    const type = field[y][x];
    if (type > 0) {
      switch (type) {
        case 1:
          return "block-i";
        case 2:
          return "block-o";
        case 3:
          return "block-s";
        case 4:
          return "block-z";
        case 5:
          return "block-j";
        case 6:
          return "block-l";
        case 7:
          return "block-t";
        default:
          return "";
        }
    }
  };
</script>

<template>
  <div>
    <h1>play screen</h1>
    <h2>user-name: {{ $route.query.name }}</h2>
  </div>

  <div class="container">
    <table class="field" style="border-collapse: collapse">
      <tr
        v-for="(row, y) in field"
        :key="y">
        <td
          class="block"
          v-for="(col, x) in row"
          :key="() => '${x}${y}'"
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
  width: 1em;
  height: 1em;
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








// const tetrominos = [
//   [
//     // 0: 空白
//     [0],
//   ],
//   [
//     // 1: I-テトリミノ（水色）
//     [1, 1, 1, 1],
//   ],
//   [
//     // 2: O-テトリミノ（黄色）
//     [2, 2],
//     [2, 2],
//   ],
//   [
//     // 3: S-テトリミノ（緑）
//     [0, 3, 3],
//     [3, 3, 0],
//   ],
//   [
//     // 4: Z-テトリミノ（赤）
//     [4, 4, 0],
//     [0, 4, 4],
//   ],
//   [
//     // 5: J-テトリミノ（青）
//     [0, 0, 5],
//     [5, 5, 5],
//   ],
//   [
//     // 6: L-テトリミノ（オレンジ）
//     [6, 0, 0],
//     [6, 6, 6],
//   ],
//   [
//     // 7: T-テトリミノ（紫）
//     [0, 7, 0],
//     [7, 7, 7],
//   ],
// ];
