<!-- eslint-disable vue/multi-word-component-names -->
<script>
import jsonData from '../data/schedule.json';

export default {
  data() {
    return {
      schedule: [],
      modifiedSchedule: [],
      isDragging: false,
      startDragIndex: null,
    };
  },
  mounted() {
    this.schedule = jsonData;

    const getDateFromLocalStorage = JSON.parse(localStorage.getItem('schedule'));
    const isEmpty = Object.values(getDateFromLocalStorage).every((time) => time.length === 0);

    const data = isEmpty ? jsonData : getDateFromLocalStorage;

    const modificationSchedule = [];

    for (const key in data) {
      if (!data[key].length) {
        modificationSchedule.push({
          day: key,
          times: [],
        });
      } else {
        const cellsToFill = [];

        data[key].forEach((time) => {
          const start = Math.ceil((time.bt / 60));
          const end = Math.ceil((time.et - time.bt) / 60) + start;

          for (let i = start + 1; i <= end; i++) {
            cellsToFill.push(i);
          }
        });

        modificationSchedule.push({
          day: key,
          times: cellsToFill,
        });
      }

      this.modifiedSchedule = modificationSchedule;
    }
  },

  methods: {
    toggleHighlight(day, index) {
      if (day.times.includes(index)) {
        day.times = day.times.filter((timeIndex) => timeIndex !== index);
      } else {
        day.times.push(index);
      }
    },
    isHighlighted(day, index) {
      return day.times.includes(index);
    },
    handleMouseDown(index) {
      this.isDragging = true;
      this.startDragIndex = index;
    },
    handleMouseUp() {
      this.isDragging = false;
      this.startDragIndex = null;
    },
    handleMouseMove(day, index) {
      if (this.isDragging && this.startDragIndex !== null) {
        const start = Math.min(this.startDragIndex, index);
        const end = Math.max(this.startDragIndex, index);

        day.times = day.times.filter((timeIndex) => timeIndex < start || timeIndex > end);

        for (let i = start; i <= end; i++) {
          day.times.push(i);
        }
      }
    },
    clearCells() {
      for (const day of this.modifiedSchedule) {
        day.times = [];
      }
    },
    toggleSection(day) {
      if (day.times.length === 24) {
        day.times = [];
      } else {
        const cellsToFill = Array.from({ length: 24 }, (_, index) => index + 1);
        day.times = cellsToFill;
      }
    },
    saveChanges() {
      const result = {};

      for (const item of this.modifiedSchedule) {
        const { day } = item;
        const { times } = item;
        const newTimes = [];

        for (const time of times) {
          const bt = (time - 1) * 60;
          const et = bt + 59;

          newTimes.push({ bt, et });
        }

        result[day] = newTimes;
      }

      this.schedule = result;
      const jsonSchedule = JSON.stringify(this.schedule);
      localStorage.setItem('schedule', jsonSchedule);
    },
  },
};
</script>

<template>

    <table>
        <thead>
            <tr>
                <th></th>
                <th>ALL<br>DAY</th>
                <th colspan="3">00:00</th>
                <th colspan="3">03:00</th>
                <th colspan="3">06:00</th>
                <th colspan="3">09:00</th>
                <th colspan="3">12:00</th>
                <th colspan="3">15:00</th>
                <th colspan="3">18:00</th>
                <th colspan="3">21:00</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for=" (day, key) in modifiedSchedule" :key="key">
                <th :class="day.times.length >= 1 ? 'grey' : ''">
                    {{ modifiedSchedule[key].day }}
                </th>
                <td class="tick-done" @click="toggleSection(modifiedSchedule[key])">
                    {{ day.times.length === 24 ?  '✓' : '' }}
                </td>
                <td v-for="(index) in 24"
                    :key="index"
                    class="draggable"
                    @mouseup="handleMouseUp"
                    :class="isHighlighted(modifiedSchedule[key], index) ? 'highlighted' : ''"
                    @click="toggleHighlight(modifiedSchedule[key], index)"
                    @mousedown="handleMouseDown(index)"
                    @mousemove="handleMouseMove(modifiedSchedule[key], index)"
                >
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="26" class="button-container">
                    <button class="button button--red" @click="clearCells()">Clear</button>
                    <button class="button" @click="saveChanges()">Save Changes</button>
                </td>
            </tr>
        </tfoot>
    </table>
</template>

<style>
table {
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
}

.draggable {
    cursor: move;
}

.highlighted {
    background-color: #BEBEBE;
}

.tick-done {
    text-align: center;
    background-color: grey;
    color: azure;
}

.grey {
    background-color: #BEBEBE;
}

.button-container {
    text-align: right;
}

.button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-right: 10px;
    cursor: pointer;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
}

.button:hover {
    box-shadow: 0 8px 10px 0 rgba(0,0,0,0.24),0 17px 40px 0 rgba(0,0,0,0.19);
}

.button--red {
    background-color: #f44336;
}

</style>
