import data from "./data";

export default class Catalog {
  constructor(table) {
    this.table = table;
    this.data = data;
    this.sort = [];
    this.valuesForSorting = [];
  }

  init() {
    this.redrawTable(this.data);
    this.tHeader = document.querySelectorAll("th");

    [...this.tHeader].forEach((elem) =>
      this.valuesForSorting.push(elem.textContent)
    );

    this.displayValue(this.valuesForSorting, 0);
  }

  redrawTable(dataArr) {
    dataArr.forEach((elem) => {
      const template = `
<tr class="movie">
				<td>${elem.id}</td>
				<td>${elem.title}</td>
				<td>(${elem.year})</td>
				<td>imdb: ${elem.imdb.toFixed(2)}</td>
			</tr>`;
      this.table.insertAdjacentHTML("beforeend", template);
    });
  }

  sortValues(value) {
    if (value === "title") {
      this.sort = this.data.sort((prev, next) => {
        if (next.title > prev.title) return 1;
        if (next.title < prev.title) return -1;
      });
    } else {
      this.sort = [...this.data].sort((prev, next) => {
        return Number(next[value]) - Number(prev[value]);
      });
    }

    return this.sort;
  }

  refresh() {
    // перерисовка с учетом задержки 2 сек
    this.redrawList();

    this.sort = this.sort.reverse();
    setTimeout(() => {
      this.redrawList(this.sort);
    }, 2000);
  }

  redrawList() {
    // Перерисовка таблицы в соответствии с сортировкой
    this.movie = document.querySelectorAll(".movie");

    const rotateTriangle = [...this.tHeader].find((elem) =>
      elem.firstElementChild.classList.contains("triangle-up")
    );
    if (rotateTriangle) {
      rotateTriangle.firstElementChild.style.transform = "rotate(180deg)";
    }

    this.movie.forEach((elem) => {
      document.querySelector("tbody").removeChild(elem);
    });

    this.redrawTable(this.sort);
  }

  triangle(itemName) {
    // добавляет треугольник

    [...this.tHeader].forEach((elem) => {
      elem.firstElementChild.classList.remove("triangle-up");
      elem.firstElementChild.style.transform = "";
    });

    const findItem = [...this.tHeader].find(
      (elem) => elem.textContent === itemName
    );

    findItem.firstElementChild.classList.add("triangle-up");
  }

  displayValue(arr, i) {
    if (i < arr.length) {
      const timerId = setTimeout(() => {
        if (i < arr.length) {
          this.sortValues(arr[i]);
          this.refresh();
          this.triangle(arr[i]);
          this.displayValue(arr, [++i]);
          if (i === arr.length) {
            clearTimeout(timerId);
            i = 0;
            this.displayValue(arr, 0);
          }
        }
      }, 4000);
    }
  }
}
