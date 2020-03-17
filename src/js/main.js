"use strict";

const table = document.querySelector(".table__body--js");
const form = document.querySelector(".form--js");
const searchCompany = document.getElementById("filter");
const select = document.querySelector(".form__select--js");
const pagination = document.querySelector(".pagination--js");
let companyDetails = [];
let detailsContener = null;

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
    detailsContener = document.querySelector('.details--js');
    const tableContainer = document.querySelector('.container');
    companyDetails = Array.from(document.querySelectorAll('.table__row--js'));

    companyDetails.map(company => company.addEventListener('click', () => {
      detailsContener.classList.add('details--visible');
      tableContainer.classList.add('container--hidden');
      let averageIncomes = null;
      let lastMonthIncome = null;

      fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)
        .then(res => res.json())
        .then(data => {
          averageIncomes = ( data.incomes.map(income => parseFloat(income.value)).reduce((a,b) => a+b) / data.incomes.length ).toFixed(2);
          
          const sortedIncomes = data.incomes.sort((a,b) => new Date(b.date) - new Date(a.date))
          const lastMonth = new Date(sortedIncomes[0].date).getMonth();
          const relevantYear = new Date(sortedIncomes[0].date).getFullYear();
          lastMonthIncome = sortedIncomes
            .filter(item => new Date(item.date).getMonth() === lastMonth && new Date(item.date).getFullYear() === relevantYear)
            .map(income => parseFloat(income.value))
            .reduce((a,b) => a+b)
            .toFixed(2);

          detailsContener.innerHTML = `
          <div class="details__box">
            <h1>${company.cells[1].textContent}</h1>
            <p>City: ${company.cells[2].textContent}</p>
            <p>Total income: ${company.cells[3].textContent}</p>
            <p>Average income: ${averageIncomes}</p>
            <p>Last month income (${new Date(sortedIncomes[0].date).toLocaleDateString('en-GB', {month: 'long'})}): ${lastMonthIncome}</p>
            <button class="return" id="return">Return</button>
          </div>
          `

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
