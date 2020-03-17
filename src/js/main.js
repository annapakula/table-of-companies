"use strict";

const table = document.querySelector(".table__body--js");
const searchCompany = document.getElementById("filter");

let companiesData = [];
let filteredCompanies = [];

searchCompany.onchange = handleChange;

function handleChange(e) {
  setTimeout(() => {
    let userInput = e.target.value;
    filteredCompanies = companiesData.filter(company =>
      company.name.toLowerCase().includes(userInput.toLowerCase())
    );
    showData(filteredCompanies);
  }, 1000);
}

function fetchData() {
  fetch("https://recruitment.hal.skygate.io/companies")
    .then(res => res.json())
    .then(data => {
      data.map(company => {
        fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)
          .then(res => res.json())
          .then(res => {
            const companyIncome = res.incomes
              .map(income => parseFloat(income.value))
              .reduce((a, b) => a + b);

            companiesData.push({
              id: company.id,
              name: company.name,
              city: company.city,
              income: companyIncome.toFixed(2)
            });
            companiesData.sort((a, b) => b.income - a.income);
            showData(companiesData);
            // showData(company.id, company.name, company.city, companyIncome.toFixed(2))

            // tableRows.push({
            //   income: companyIncome.toFixed(2),
            //   content: `
            //     <tr class="table__row">
            //       <td class="table__data">${company.id}</td>
            //       <td class="table__data">${company.name}</td>
            //       <td class="table__data">${company.city}</td>
            //       <td class="table__data">${companyIncome.toFixed(2)}</td>
            //     </tr>
            //   `
            // });
            // const rows = tableRows.sort((a, b) => b.income - a.income).map(row => row.content).join('');
            // table.innerHTML = `${rows}`;
          });
      });
    });
}

// function showData(id, name, city, income) {
function showData(data) {
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
    .join("");
}

fetchData();
