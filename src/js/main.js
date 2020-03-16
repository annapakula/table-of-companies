"use strict";

const table = document.querySelector('.table--js');


fetch('https://recruitment.hal.skygate.io/companies')
  .then(res => res.json())
  .then(data => {

    // const companies = [];
    const tableRows = [];

    data.map(company => {
      fetch('https://recruitment.hal.skygate.io/incomes/' + company.id)
        .then(res => res.json())
        .then(res => {
          const companyIncome = res.incomes.map(income => parseFloat(income.value)).reduce((a, b) => a + b);

          tableRows.push({ 
            income: companyIncome.toFixed(2),
            content: `
              <tr class="table__row">
                <td class="table__data">${company.id}</td>
                <td class="table__data">${company.name}</td>
                <td class="table__data">${company.city}</td>
                <td class="table__data">${companyIncome.toFixed(2)}</td>
              </tr>
            `
          });
        })
        .then(res => {
          tableRows.sort((a, b) => b.income - a.income)

          table.innerHTML = `
          <tr class="table__header">
            <th class="table__header table__header--id scope="col">Id</th>
            <th class="table__header scope="col">Company</th>
            <th class="table__header scope="col">City</th>
            <th class="table__header table__header--income scope="col">Total income</th>
          </tr>
          ${tableRows.map(row => row.content).join('')}
    `;
        })
      })
  })
