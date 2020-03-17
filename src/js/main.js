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
// let companiesData = [];
// let filteredCompanies = [];
// let page = 0;
// let perPage = 10;
// let loaded = false;
if (!state.loaded) {
  table.innerHTML = `<tr><td colspan="4" class="loader"><div class="loader__item"></div></td></tr>`;
}

searchCompany.onkeypress = handleChange;
// searchCompany.onchange = handleChange;
form.onsubmit = handleSubmit;
select.onchange = handleSelect;

function handleChange(e) {
  setTimeout(() => {
    let userInput = e.target.value;
    state.filteredCompanies = state.companiesData.filter(company =>
      company.name.toLowerCase().includes(userInput.toLowerCase())
    );
    showData(state.filteredCompanies, state.perPage);
  }, 1000);
}

function handleSelect(e) {
  state.perPage = parseInt(e.target.value);
  showData(state.companiesData, state.perPage);
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

function showData(data, perPage) {
  const sliceFrom = 0 + perPage * state.page;
  const sliceTo = perPage + perPage * state.page;
  pagination.innerHTML = "";

  table.innerHTML = data
    .map(
      company => `
        <tr class="table__row">
        <td class="table__data">${company.id}</td>
          <td class="table__data">${company.name}</td>
          <td class="table__data">${company.city}</td>
          <td class="table__data">${company.income}</td>
          </tr>
          `
    )
    .slice(sliceFrom, sliceTo)
    .join("");


  /* HANDLE PAGINATION */
  for (let i = 1; i <= state.companiesData.length / state.perPage; i++) {
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
      console.log(e.target.textContent);
      showData(state.companiesData, state.perPage);
    });
  });
}

fetchData();
