<script lang="ts" setup>

const row = 20;
const column = 10;

const field = new Array(row);

for (let i = 0; i < row; i++) {
  const fieldColumn = new Array(column).fill(0);
  field[i] = fieldColumn;
  }
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
        />
      </tr>
    </table>
  </div>
</template>


<style scoped>
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
