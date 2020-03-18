"use strict";

const table = document.querySelector(".table__body--js");
const form = document.querySelector(".form--js");
const searchCompany = document.getElementById("filter");
const select = document.querySelector(".form__select--js");
const pagination = document.querySelector(".pagination--js");

let state = {
  companiesData: [],
  filteredCompanies: [],
  page: 0,
  perPage: 10,
  loaded: false,
}

if (!state.loaded) {
  table.innerHTML = `<tr><td colspan="4" class="loader"><div class="loader__item"></div></td></tr>`;
}

searchCompany.onkeypress = handleKeypress;
form.onsubmit = handleSubmit;
select.onchange = handleSelect;

function handleKeypress(e) {
  setTimeout(() => {
    let userInput = e.target.value;
    state.filteredCompanies = state.companiesData.filter(company =>
      company.name.toLowerCase().includes(userInput.toLowerCase())
    );
    state.page = 0;
    showData(state.filteredCompanies);
  }, 1000);
}

function handleSelect(e) {
  state.page = 0;
  state.perPage = parseInt(e.target.value);
  showData(state.companiesData);
}

function handleSubmit(e) {
  e.preventDefault();
}

function fetchData() {
  fetch("https://recruitment.hal.skygate.io/companies")
    .then(res => res.json())
    .then(data => {
      const dataLength = data.length;
      data.map(company => {
        fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)
          .then(res => res.json())
          .then(res => {
            const companyIncome = res.incomes
              .map(income => parseFloat(income.value))
              .reduce((a, b) => a + b);

              state.companiesData.push({
              id: company.id,
              name: company.name,
              city: company.city,
              income: companyIncome.toFixed(2)
            });
            if (state.companiesData.length === dataLength) {
              state.companiesData.sort((a, b) => b.income - a.income);
              showData(state.companiesData, 10);
            }
          });
      });
    });
}

function showData(data) {
  let sliceFrom = 0 + state.perPage * state.page;
  let sliceTo = state.perPage + state.perPage * state.page;
  pagination.innerHTML = "";

  table.innerHTML = data
    .map(
      company => `
        <tr class="table__row table__row--js" id="${company.id}">
          <td class="table__data">${company.id}</td>
          <td class="table__data">${company.name}</td>
          <td class="table__data">${company.city}</td>
          <td class="table__data">${company.income}</td>
        </tr>
        `
    )
    .slice(sliceFrom, sliceTo)
    .join("");


/* HANDLE COMPANY DETAILS */

const detailsContener = document.querySelector('.details--js');
const tableContainer = document.querySelector('.container');
const companyDetails = Array.from(document.querySelectorAll('.table__row--js'));

    function countAvgIncomes(data) {
      const avgIncomes = data.map(income => parseFloat(income.value)).reduce((a,b) => a+b) / data.length;
      return avgIncomes.toFixed(2);
    }

    function countTotalIncomes(data) {
      return data
      .map(income => parseFloat(income.value))
      .reduce((a,b) => a+b)
      .toFixed(2);
    }

    companyDetails.map(company => company.addEventListener('click', () => {
      detailsContener.classList.add('details--visible');
      tableContainer.classList.add('container--hidden');
      let averageIncomes = null;
      let lastMonthIncome = null;
      let totalRangeIncome = 'No incomes in selected range';
      let avgRangeIncome = 'No incomes in selected range';

      fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)
        .then(res => res.json())
        .then(data => {
          
          const sortedIncomes = data.incomes.sort((a,b) => new Date(b.date) - new Date(a.date))
          const lastMonth = new Date(sortedIncomes[0].date).getMonth();
          const relevantYear = new Date(sortedIncomes[0].date).getFullYear();
          const filteredIncomes = sortedIncomes.filter(item => new Date(item.date).getMonth() === lastMonth && new Date(item.date).getFullYear() === relevantYear)
          
          lastMonthIncome = countTotalIncomes(filteredIncomes)
          averageIncomes = countAvgIncomes(data.incomes)
          
          detailsContener.innerHTML = `
          <div class="details__box">
          <h1>${company.cells[1].textContent}</h1>
          <p><b>City:</b> ${company.cells[2].textContent}</p>
          <p><b>Total income:</b> ${company.cells[3].textContent}</p>
          <p><b>Average income:</b> ${averageIncomes}</p>
          <p><b>Last month income</b> (${new Date(sortedIncomes[0].date).toLocaleDateString('en-GB', {month: 'long'})}): ${lastMonthIncome}</p>
          <p><b>Show total and average incomes</b></p>
        
          <p>
            <label for="incomes-from">From: </label>
            <input type="date" id="incomes-from">
            <label for="incomes-to">To: </label>
            <input type="date" id="incomes-to">
            <div class="tooltip tooltip--js">
              <span class="tooltiptext">Choose subsequent date or the same as a date 'From'</span>
            </div>
          </p>

          <div class="details__range details__range--js"></div>

          <button class="return" id="return">Return</button>
          </div>
          `

          const incomesFrom = document.getElementById('incomes-from');
          const incomesTo = document.getElementById('incomes-to');
          const tooltip = document.querySelector('.tooltip--js');
          const detailsRange = document.querySelector('.details__range--js');
          let dateFrom = null;
          let dateTo = null;

          incomesFrom.addEventListener('change', (e) => {
            if(e.target.value <= dateTo) {
              tooltip.classList.remove('tooltip--visible');
            } else {
              tooltip.classList.add('tooltip--visible');
              totalRangeIncome = 'No incomes in selected range';
              avgRangeIncome = 'No incomes in selected range';
              detailsRange.innerHTML = '';
            }
            dateFrom = e.target.value;
            filterIncomesFromRange();
          })
          
          incomesTo.addEventListener('change', (e) => {
            if(e.target.value < dateFrom) {
              tooltip.classList.add('tooltip--visible');
              totalRangeIncome = 'No incomes in selected range';
              avgRangeIncome = 'No incomes in selected range';
              detailsRange.innerHTML = '';
            } else {
              tooltip.classList.remove('tooltip--visible');
          }

            dateTo = e.target.value;
            filterIncomesFromRange();
          })

          function filterIncomesFromRange() {
            if(dateTo >= dateFrom && dateFrom !== null && dateTo !== null) {
              const filteredIncomesFromRange = sortedIncomes.filter(item => new Date(item.date).getTime() >= new Date(dateFrom).getTime() && new Date(item.date).getTime() <= new Date(dateTo).getTime());

              if(filteredIncomesFromRange != false) {
                totalRangeIncome = countTotalIncomes(filteredIncomesFromRange);
                avgRangeIncome = countAvgIncomes(filteredIncomesFromRange)
              }
                detailsRange.innerHTML = `
                <p>total: ${totalRangeIncome}</p>
                <p>average: ${avgRangeIncome}</p>
                `;
            }
          }

          const returnButton = document.getElementById('return');
          returnButton.addEventListener('click', () => {
            detailsContener.classList.remove('details--visible')
            tableContainer.classList.remove('container--hidden')
          })
        })
    }))

/* HANDLE PAGINATION */
  for (let i = 1; i <= Math.ceil(data.length / state.perPage); i++) {
    pagination.innerHTML += `
      <button class="pagination__button pagination__button--js">${i}</button>
      `;
  }

  const buttons = Array.from(
    document.querySelectorAll(".pagination__button--js")
  );
  
  buttons.map(button => {
    button.addEventListener("click", e => {
      state.page = e.target.textContent - 1;
      showData(data, state.perPage);
    });
  });
}

fetchData();
