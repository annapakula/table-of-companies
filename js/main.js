!function(n){var c={};function I(t){if(c[t])return c[t].exports;var g=c[t]={i:t,l:!1,exports:{}};return n[t].call(g.exports,g,g.exports,I),g.l=!0,g.exports}I.m=n,I.c=c,I.d=function(n,c,t){I.o(n,c)||Object.defineProperty(n,c,{enumerable:!0,get:t})},I.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},I.t=function(n,c){if(1&c&&(n=I(n)),8&c)return n;if(4&c&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(I.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&c&&"string"!=typeof n)for(var g in n)I.d(t,g,function(c){return n[c]}.bind(null,g));return t},I.n=function(n){var c=n&&n.__esModule?function(){return n.default}:function(){return n};return I.d(c,"a",c),c},I.o=function(n,c){return Object.prototype.hasOwnProperty.call(n,c)},I.p="",I(I.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nconst table = document.querySelector(".table__body--js");\r\nconst form = document.querySelector(".form--js");\r\nconst searchCompany = document.getElementById("filter");\r\nconst select = document.querySelector(".form__select--js");\r\nconst pagination = document.querySelector(".pagination--js");\r\n\r\nlet state = {\r\n  companiesData: [],\r\n  filteredCompanies: [],\r\n  page: 0,\r\n  perPage: 10,\r\n  loaded: false,\r\n}\r\n\r\nif (!state.loaded) {\r\n  table.innerHTML = `<tr><td colspan="4" class="loader"><div class="loader__item"></div></td></tr>`;\r\n}\r\n\r\nsearchCompany.onkeypress = handleKeypress;\r\nform.onsubmit = handleSubmit;\r\nselect.onchange = handleSelect;\r\n\r\nfunction handleKeypress(e) {\r\n  setTimeout(() => {\r\n    let userInput = e.target.value;\r\n    state.filteredCompanies = state.companiesData.filter(company =>\r\n      company.name.toLowerCase().includes(userInput.toLowerCase())\r\n    );\r\n    state.page = 0;\r\n    showData(state.filteredCompanies);\r\n  }, 1000);\r\n}\r\n\r\nfunction handleSelect(e) {\r\n  state.page = 0;\r\n  state.perPage = parseInt(e.target.value);\r\n  showData(state.companiesData);\r\n}\r\n\r\nfunction handleSubmit(e) {\r\n  e.preventDefault();\r\n}\r\n\r\nfunction fetchData() {\r\n  fetch("https://recruitment.hal.skygate.io/companies")\r\n    .then(res => res.json())\r\n    .then(data => {\r\n      const dataLength = data.length;\r\n      data.map(company => {\r\n        fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)\r\n          .then(res => res.json())\r\n          .then(res => {\r\n            const companyIncome = res.incomes\r\n              .map(income => parseFloat(income.value))\r\n              .reduce((a, b) => a + b);\r\n\r\n              state.companiesData.push({\r\n              id: company.id,\r\n              name: company.name,\r\n              city: company.city,\r\n              income: companyIncome.toFixed(2)\r\n            });\r\n            if (state.companiesData.length === dataLength) {\r\n              state.companiesData.sort((a, b) => b.income - a.income);\r\n              showData(state.companiesData, 10);\r\n            }\r\n          });\r\n      });\r\n    });\r\n}\r\n\r\nfunction showData(data) {\r\n  let sliceFrom = 0 + state.perPage * state.page;\r\n  let sliceTo = state.perPage + state.perPage * state.page;\r\n  pagination.innerHTML = "";\r\n\r\n  table.innerHTML = data\r\n    .map(\r\n      company => `\r\n        <tr class="table__row table__row--js" id="${company.id}">\r\n          <td class="table__data">${company.id}</td>\r\n          <td class="table__data">${company.name}</td>\r\n          <td class="table__data">${company.city}</td>\r\n          <td class="table__data">${company.income}</td>\r\n        </tr>\r\n        `\r\n    )\r\n    .slice(sliceFrom, sliceTo)\r\n    .join("");\r\n\r\n\r\n/* HANDLE COMPANY DETAILS */\r\n\r\nconst detailsContener = document.querySelector(\'.details--js\');\r\nconst tableContainer = document.querySelector(\'.container\');\r\nconst companyDetails = Array.from(document.querySelectorAll(\'.table__row--js\'));\r\n\r\n    function countAvgIncomes(data) {\r\n      const avgIncomes = data.map(income => parseFloat(income.value)).reduce((a,b) => a+b) / data.length;\r\n      return avgIncomes.toFixed(2);\r\n    }\r\n\r\n    function countTotalIncomes(data) {\r\n      return data\r\n      .map(income => parseFloat(income.value))\r\n      .reduce((a,b) => a+b)\r\n      .toFixed(2);\r\n    }\r\n\r\n    companyDetails.map(company => company.addEventListener(\'click\', () => {\r\n      detailsContener.classList.add(\'details--visible\');\r\n      tableContainer.classList.add(\'container--hidden\');\r\n      let averageIncomes = null;\r\n      let lastMonthIncome = null;\r\n      let totalRangeIncome = \'No incomes in selected range\';\r\n      let avgRangeIncome = \'No incomes in selected range\';\r\n\r\n      fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)\r\n        .then(res => res.json())\r\n        .then(data => {\r\n          \r\n          const sortedIncomes = data.incomes.sort((a,b) => new Date(b.date) - new Date(a.date))\r\n          const lastMonth = new Date(sortedIncomes[0].date).getMonth();\r\n          const relevantYear = new Date(sortedIncomes[0].date).getFullYear();\r\n          const filteredIncomes = sortedIncomes.filter(item => new Date(item.date).getMonth() === lastMonth && new Date(item.date).getFullYear() === relevantYear)\r\n          \r\n          lastMonthIncome = countTotalIncomes(filteredIncomes)\r\n          averageIncomes = countAvgIncomes(data.incomes)\r\n          \r\n          detailsContener.innerHTML = `\r\n          <div class="details__box">\r\n          <h1>${company.cells[1].textContent}</h1>\r\n          <p><b>City:</b> ${company.cells[2].textContent}</p>\r\n          <p><b>Total income:</b> ${company.cells[3].textContent}</p>\r\n          <p><b>Average income:</b> ${averageIncomes}</p>\r\n          <p><b>Last month income</b> (${new Date(sortedIncomes[0].date).toLocaleDateString(\'en-GB\', {month: \'long\'})}): ${lastMonthIncome}</p>\r\n          <p><b>Show total and average incomes</b></p>\r\n        \r\n          <p>\r\n            <label for="incomes-from">From: </label>\r\n            <input type="date" id="incomes-from">\r\n            <label for="incomes-to">To: </label>\r\n            <input type="date" id="incomes-to">\r\n            <div class="tooltip tooltip--js">\r\n              <span class="tooltiptext">Choose subsequent date or the same as a date \'From\'</span>\r\n            </div>\r\n          </p>\r\n\r\n          <div class="details__range details__range--js"></div>\r\n\r\n          <button class="return" id="return">Return</button>\r\n          </div>\r\n          `\r\n\r\n          const incomesFrom = document.getElementById(\'incomes-from\');\r\n          const incomesTo = document.getElementById(\'incomes-to\');\r\n          const tooltip = document.querySelector(\'.tooltip--js\');\r\n          const detailsRange = document.querySelector(\'.details__range--js\');\r\n          let dateFrom = null;\r\n          let dateTo = null;\r\n\r\n          incomesFrom.addEventListener(\'change\', (e) => {\r\n            if(e.target.value <= dateTo) {\r\n              tooltip.classList.remove(\'tooltip--visible\');\r\n            } else {\r\n              tooltip.classList.add(\'tooltip--visible\');\r\n              totalRangeIncome = \'No incomes in selected range\';\r\n              avgRangeIncome = \'No incomes in selected range\';\r\n              detailsRange.innerHTML = \'\';\r\n            }\r\n            dateFrom = e.target.value;\r\n            filterIncomesFromRange();\r\n          })\r\n          \r\n          incomesTo.addEventListener(\'change\', (e) => {\r\n            if(e.target.value < dateFrom) {\r\n              tooltip.classList.add(\'tooltip--visible\');\r\n              totalRangeIncome = \'No incomes in selected range\';\r\n              avgRangeIncome = \'No incomes in selected range\';\r\n              detailsRange.innerHTML = \'\';\r\n            } else {\r\n              tooltip.classList.remove(\'tooltip--visible\');\r\n          }\r\n\r\n            dateTo = e.target.value;\r\n            filterIncomesFromRange();\r\n          })\r\n\r\n          function filterIncomesFromRange() {\r\n            if(dateTo >= dateFrom && dateFrom !== null && dateTo !== null) {\r\n              const filteredIncomesFromRange = sortedIncomes.filter(item => new Date(item.date).getTime() >= new Date(dateFrom).getTime() && new Date(item.date).getTime() <= new Date(dateTo).getTime());\r\n\r\n              if(filteredIncomesFromRange != false) {\r\n                totalRangeIncome = countTotalIncomes(filteredIncomesFromRange);\r\n                avgRangeIncome = countAvgIncomes(filteredIncomesFromRange)\r\n              }\r\n                detailsRange.innerHTML = `\r\n                <p>total: ${totalRangeIncome}</p>\r\n                <p>average: ${avgRangeIncome}</p>\r\n                `;\r\n            }\r\n          }\r\n\r\n          const returnButton = document.getElementById(\'return\');\r\n          returnButton.addEventListener(\'click\', () => {\r\n            detailsContener.classList.remove(\'details--visible\')\r\n            tableContainer.classList.remove(\'container--hidden\')\r\n          })\r\n        })\r\n    }))\r\n\r\n/* HANDLE PAGINATION */\r\n  for (let i = 1; i <= Math.ceil(data.length / state.perPage); i++) {\r\n    pagination.innerHTML += `\r\n      <button class="pagination__button pagination__button--js">${i}</button>\r\n      `;\r\n  }\r\n\r\n  const buttons = Array.from(\r\n    document.querySelectorAll(".pagination__button--js")\r\n  );\r\n  \r\n  buttons.map(button => {\r\n    button.addEventListener("click", e => {\r\n      state.page = e.target.textContent - 1;\r\n      showData(data, state.perPage);\r\n    });\r\n  });\r\n}\r\n\r\nfetchData();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFdBQVc7QUFDL0Qsb0NBQW9DLFdBQVc7QUFDL0Msb0NBQW9DLGFBQWE7QUFDakQsb0NBQW9DLGFBQWE7QUFDakQsb0NBQW9DLGVBQWU7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLDZCQUE2QjtBQUM3Qyw0QkFBNEIsNkJBQTZCO0FBQ3pELG9DQUFvQyw2QkFBNkI7QUFDakUsc0NBQXNDLGVBQWU7QUFDckQseUNBQXlDLDZEQUE2RCxjQUFjLEVBQUUsS0FBSyxnQkFBZ0I7QUFDM0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0MsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0EsaUJBQWlCLDZDQUE2QztBQUM5RDtBQUNBLGtFQUFrRSxFQUFFO0FBQ3BFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFibGVfX2JvZHktLWpzXCIpO1xyXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLS1qc1wiKTtcclxuY29uc3Qgc2VhcmNoQ29tcGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpO1xyXG5jb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX3NlbGVjdC0tanNcIik7XHJcbmNvbnN0IHBhZ2luYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb24tLWpzXCIpO1xyXG5cclxubGV0IHN0YXRlID0ge1xyXG4gIGNvbXBhbmllc0RhdGE6IFtdLFxyXG4gIGZpbHRlcmVkQ29tcGFuaWVzOiBbXSxcclxuICBwYWdlOiAwLFxyXG4gIHBlclBhZ2U6IDEwLFxyXG4gIGxvYWRlZDogZmFsc2UsXHJcbn1cclxuXHJcbmlmICghc3RhdGUubG9hZGVkKSB7XHJcbiAgdGFibGUuaW5uZXJIVE1MID0gYDx0cj48dGQgY29sc3Bhbj1cIjRcIiBjbGFzcz1cImxvYWRlclwiPjxkaXYgY2xhc3M9XCJsb2FkZXJfX2l0ZW1cIj48L2Rpdj48L3RkPjwvdHI+YDtcclxufVxyXG5cclxuc2VhcmNoQ29tcGFueS5vbmtleXByZXNzID0gaGFuZGxlS2V5cHJlc3M7XHJcbmZvcm0ub25zdWJtaXQgPSBoYW5kbGVTdWJtaXQ7XHJcbnNlbGVjdC5vbmNoYW5nZSA9IGhhbmRsZVNlbGVjdDtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUtleXByZXNzKGUpIHtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGxldCB1c2VySW5wdXQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIHN0YXRlLmZpbHRlcmVkQ29tcGFuaWVzID0gc3RhdGUuY29tcGFuaWVzRGF0YS5maWx0ZXIoY29tcGFueSA9PlxyXG4gICAgICBjb21wYW55Lm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh1c2VySW5wdXQudG9Mb3dlckNhc2UoKSlcclxuICAgICk7XHJcbiAgICBzdGF0ZS5wYWdlID0gMDtcclxuICAgIHNob3dEYXRhKHN0YXRlLmZpbHRlcmVkQ29tcGFuaWVzKTtcclxuICB9LCAxMDAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2VsZWN0KGUpIHtcclxuICBzdGF0ZS5wYWdlID0gMDtcclxuICBzdGF0ZS5wZXJQYWdlID0gcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpO1xyXG4gIHNob3dEYXRhKHN0YXRlLmNvbXBhbmllc0RhdGEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQoZSkge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmV0Y2hEYXRhKCkge1xyXG4gIGZldGNoKFwiaHR0cHM6Ly9yZWNydWl0bWVudC5oYWwuc2t5Z2F0ZS5pby9jb21wYW5pZXNcIilcclxuICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuICAgICAgZGF0YS5tYXAoY29tcGFueSA9PiB7XHJcbiAgICAgICAgZmV0Y2goXCJodHRwczovL3JlY3J1aXRtZW50LmhhbC5za3lnYXRlLmlvL2luY29tZXMvXCIgKyBjb21wYW55LmlkKVxyXG4gICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wYW55SW5jb21lID0gcmVzLmluY29tZXNcclxuICAgICAgICAgICAgICAubWFwKGluY29tZSA9PiBwYXJzZUZsb2F0KGluY29tZS52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG5cclxuICAgICAgICAgICAgICBzdGF0ZS5jb21wYW5pZXNEYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgIGlkOiBjb21wYW55LmlkLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGNvbXBhbnkubmFtZSxcclxuICAgICAgICAgICAgICBjaXR5OiBjb21wYW55LmNpdHksXHJcbiAgICAgICAgICAgICAgaW5jb21lOiBjb21wYW55SW5jb21lLnRvRml4ZWQoMilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5jb21wYW5pZXNEYXRhLmxlbmd0aCA9PT0gZGF0YUxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHN0YXRlLmNvbXBhbmllc0RhdGEuc29ydCgoYSwgYikgPT4gYi5pbmNvbWUgLSBhLmluY29tZSk7XHJcbiAgICAgICAgICAgICAgc2hvd0RhdGEoc3RhdGUuY29tcGFuaWVzRGF0YSwgMTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0RhdGEoZGF0YSkge1xyXG4gIGxldCBzbGljZUZyb20gPSAwICsgc3RhdGUucGVyUGFnZSAqIHN0YXRlLnBhZ2U7XHJcbiAgbGV0IHNsaWNlVG8gPSBzdGF0ZS5wZXJQYWdlICsgc3RhdGUucGVyUGFnZSAqIHN0YXRlLnBhZ2U7XHJcbiAgcGFnaW5hdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICB0YWJsZS5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAubWFwKFxyXG4gICAgICBjb21wYW55ID0+IGBcclxuICAgICAgICA8dHIgY2xhc3M9XCJ0YWJsZV9fcm93IHRhYmxlX19yb3ctLWpzXCIgaWQ9XCIke2NvbXBhbnkuaWR9XCI+XHJcbiAgICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZV9fZGF0YVwiPiR7Y29tcGFueS5pZH08L3RkPlxyXG4gICAgICAgICAgPHRkIGNsYXNzPVwidGFibGVfX2RhdGFcIj4ke2NvbXBhbnkubmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkIGNsYXNzPVwidGFibGVfX2RhdGFcIj4ke2NvbXBhbnkuY2l0eX08L3RkPlxyXG4gICAgICAgICAgPHRkIGNsYXNzPVwidGFibGVfX2RhdGFcIj4ke2NvbXBhbnkuaW5jb21lfTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgICAgICBgXHJcbiAgICApXHJcbiAgICAuc2xpY2Uoc2xpY2VGcm9tLCBzbGljZVRvKVxyXG4gICAgLmpvaW4oXCJcIik7XHJcblxyXG5cclxuLyogSEFORExFIENPTVBBTlkgREVUQUlMUyAqL1xyXG5cclxuY29uc3QgZGV0YWlsc0NvbnRlbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldGFpbHMtLWpzJyk7XHJcbmNvbnN0IHRhYmxlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpO1xyXG5jb25zdCBjb21wYW55RGV0YWlscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYmxlX19yb3ctLWpzJykpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvdW50QXZnSW5jb21lcyhkYXRhKSB7XHJcbiAgICAgIGNvbnN0IGF2Z0luY29tZXMgPSBkYXRhLm1hcChpbmNvbWUgPT4gcGFyc2VGbG9hdChpbmNvbWUudmFsdWUpKS5yZWR1Y2UoKGEsYikgPT4gYStiKSAvIGRhdGEubGVuZ3RoO1xyXG4gICAgICByZXR1cm4gYXZnSW5jb21lcy50b0ZpeGVkKDIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvdW50VG90YWxJbmNvbWVzKGRhdGEpIHtcclxuICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgLm1hcChpbmNvbWUgPT4gcGFyc2VGbG9hdChpbmNvbWUudmFsdWUpKVxyXG4gICAgICAucmVkdWNlKChhLGIpID0+IGErYilcclxuICAgICAgLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFueURldGFpbHMubWFwKGNvbXBhbnkgPT4gY29tcGFueS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgZGV0YWlsc0NvbnRlbmVyLmNsYXNzTGlzdC5hZGQoJ2RldGFpbHMtLXZpc2libGUnKTtcclxuICAgICAgdGFibGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyLS1oaWRkZW4nKTtcclxuICAgICAgbGV0IGF2ZXJhZ2VJbmNvbWVzID0gbnVsbDtcclxuICAgICAgbGV0IGxhc3RNb250aEluY29tZSA9IG51bGw7XHJcbiAgICAgIGxldCB0b3RhbFJhbmdlSW5jb21lID0gJ05vIGluY29tZXMgaW4gc2VsZWN0ZWQgcmFuZ2UnO1xyXG4gICAgICBsZXQgYXZnUmFuZ2VJbmNvbWUgPSAnTm8gaW5jb21lcyBpbiBzZWxlY3RlZCByYW5nZSc7XHJcblxyXG4gICAgICBmZXRjaChcImh0dHBzOi8vcmVjcnVpdG1lbnQuaGFsLnNreWdhdGUuaW8vaW5jb21lcy9cIiArIGNvbXBhbnkuaWQpXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IHNvcnRlZEluY29tZXMgPSBkYXRhLmluY29tZXMuc29ydCgoYSxiKSA9PiBuZXcgRGF0ZShiLmRhdGUpIC0gbmV3IERhdGUoYS5kYXRlKSlcclxuICAgICAgICAgIGNvbnN0IGxhc3RNb250aCA9IG5ldyBEYXRlKHNvcnRlZEluY29tZXNbMF0uZGF0ZSkuZ2V0TW9udGgoKTtcclxuICAgICAgICAgIGNvbnN0IHJlbGV2YW50WWVhciA9IG5ldyBEYXRlKHNvcnRlZEluY29tZXNbMF0uZGF0ZSkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSW5jb21lcyA9IHNvcnRlZEluY29tZXMuZmlsdGVyKGl0ZW0gPT4gbmV3IERhdGUoaXRlbS5kYXRlKS5nZXRNb250aCgpID09PSBsYXN0TW9udGggJiYgbmV3IERhdGUoaXRlbS5kYXRlKS5nZXRGdWxsWWVhcigpID09PSByZWxldmFudFllYXIpXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGxhc3RNb250aEluY29tZSA9IGNvdW50VG90YWxJbmNvbWVzKGZpbHRlcmVkSW5jb21lcylcclxuICAgICAgICAgIGF2ZXJhZ2VJbmNvbWVzID0gY291bnRBdmdJbmNvbWVzKGRhdGEuaW5jb21lcylcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZGV0YWlsc0NvbnRlbmVyLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXRhaWxzX19ib3hcIj5cclxuICAgICAgICAgIDxoMT4ke2NvbXBhbnkuY2VsbHNbMV0udGV4dENvbnRlbnR9PC9oMT5cclxuICAgICAgICAgIDxwPjxiPkNpdHk6PC9iPiAke2NvbXBhbnkuY2VsbHNbMl0udGV4dENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgPHA+PGI+VG90YWwgaW5jb21lOjwvYj4gJHtjb21wYW55LmNlbGxzWzNdLnRleHRDb250ZW50fTwvcD5cclxuICAgICAgICAgIDxwPjxiPkF2ZXJhZ2UgaW5jb21lOjwvYj4gJHthdmVyYWdlSW5jb21lc308L3A+XHJcbiAgICAgICAgICA8cD48Yj5MYXN0IG1vbnRoIGluY29tZTwvYj4gKCR7bmV3IERhdGUoc29ydGVkSW5jb21lc1swXS5kYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUdCJywge21vbnRoOiAnbG9uZyd9KX0pOiAke2xhc3RNb250aEluY29tZX08L3A+XHJcbiAgICAgICAgICA8cD48Yj5TaG93IHRvdGFsIGFuZCBhdmVyYWdlIGluY29tZXM8L2I+PC9wPlxyXG4gICAgICAgIFxyXG4gICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbmNvbWVzLWZyb21cIj5Gcm9tOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImluY29tZXMtZnJvbVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5jb21lcy10b1wiPlRvOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImluY29tZXMtdG9cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXAgdG9vbHRpcC0tanNcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXB0ZXh0XCI+Q2hvb3NlIHN1YnNlcXVlbnQgZGF0ZSBvciB0aGUgc2FtZSBhcyBhIGRhdGUgJ0Zyb20nPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGV0YWlsc19fcmFuZ2UgZGV0YWlsc19fcmFuZ2UtLWpzXCI+PC9kaXY+XHJcblxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJldHVyblwiIGlkPVwicmV0dXJuXCI+UmV0dXJuPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIGBcclxuXHJcbiAgICAgICAgICBjb25zdCBpbmNvbWVzRnJvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmNvbWVzLWZyb20nKTtcclxuICAgICAgICAgIGNvbnN0IGluY29tZXNUbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmNvbWVzLXRvJyk7XHJcbiAgICAgICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvb2x0aXAtLWpzJyk7XHJcbiAgICAgICAgICBjb25zdCBkZXRhaWxzUmFuZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV0YWlsc19fcmFuZ2UtLWpzJyk7XHJcbiAgICAgICAgICBsZXQgZGF0ZUZyb20gPSBudWxsO1xyXG4gICAgICAgICAgbGV0IGRhdGVUbyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgaW5jb21lc0Zyb20uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgICAgICAgaWYoZS50YXJnZXQudmFsdWUgPD0gZGF0ZVRvKSB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLS12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLS12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgdG90YWxSYW5nZUluY29tZSA9ICdObyBpbmNvbWVzIGluIHNlbGVjdGVkIHJhbmdlJztcclxuICAgICAgICAgICAgICBhdmdSYW5nZUluY29tZSA9ICdObyBpbmNvbWVzIGluIHNlbGVjdGVkIHJhbmdlJztcclxuICAgICAgICAgICAgICBkZXRhaWxzUmFuZ2UuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0ZUZyb20gPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgZmlsdGVySW5jb21lc0Zyb21SYW5nZSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaW5jb21lc1RvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGUudGFyZ2V0LnZhbHVlIDwgZGF0ZUZyb20pIHtcclxuICAgICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtLXZpc2libGUnKTtcclxuICAgICAgICAgICAgICB0b3RhbFJhbmdlSW5jb21lID0gJ05vIGluY29tZXMgaW4gc2VsZWN0ZWQgcmFuZ2UnO1xyXG4gICAgICAgICAgICAgIGF2Z1JhbmdlSW5jb21lID0gJ05vIGluY29tZXMgaW4gc2VsZWN0ZWQgcmFuZ2UnO1xyXG4gICAgICAgICAgICAgIGRldGFpbHNSYW5nZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtLXZpc2libGUnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRhdGVUbyA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICBmaWx0ZXJJbmNvbWVzRnJvbVJhbmdlKCk7XHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGZpbHRlckluY29tZXNGcm9tUmFuZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmKGRhdGVUbyA+PSBkYXRlRnJvbSAmJiBkYXRlRnJvbSAhPT0gbnVsbCAmJiBkYXRlVG8gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZEluY29tZXNGcm9tUmFuZ2UgPSBzb3J0ZWRJbmNvbWVzLmZpbHRlcihpdGVtID0+IG5ldyBEYXRlKGl0ZW0uZGF0ZSkuZ2V0VGltZSgpID49IG5ldyBEYXRlKGRhdGVGcm9tKS5nZXRUaW1lKCkgJiYgbmV3IERhdGUoaXRlbS5kYXRlKS5nZXRUaW1lKCkgPD0gbmV3IERhdGUoZGF0ZVRvKS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICAgICAgICBpZihmaWx0ZXJlZEluY29tZXNGcm9tUmFuZ2UgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsUmFuZ2VJbmNvbWUgPSBjb3VudFRvdGFsSW5jb21lcyhmaWx0ZXJlZEluY29tZXNGcm9tUmFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgYXZnUmFuZ2VJbmNvbWUgPSBjb3VudEF2Z0luY29tZXMoZmlsdGVyZWRJbmNvbWVzRnJvbVJhbmdlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRldGFpbHNSYW5nZS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgICAgICA8cD50b3RhbDogJHt0b3RhbFJhbmdlSW5jb21lfTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPmF2ZXJhZ2U6ICR7YXZnUmFuZ2VJbmNvbWV9PC9wPlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IHJldHVybkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXR1cm4nKTtcclxuICAgICAgICAgIHJldHVybkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZGV0YWlsc0NvbnRlbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtLXZpc2libGUnKVxyXG4gICAgICAgICAgICB0YWJsZUNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjb250YWluZXItLWhpZGRlbicpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9KSlcclxuXHJcbi8qIEhBTkRMRSBQQUdJTkFUSU9OICovXHJcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gc3RhdGUucGVyUGFnZSk7IGkrKykge1xyXG4gICAgcGFnaW5hdGlvbi5pbm5lckhUTUwgKz0gYFxyXG4gICAgICA8YnV0dG9uIGNsYXNzPVwicGFnaW5hdGlvbl9fYnV0dG9uIHBhZ2luYXRpb25fX2J1dHRvbi0tanNcIj4ke2l9PC9idXR0b24+XHJcbiAgICAgIGA7XHJcbiAgfVxyXG5cclxuICBjb25zdCBidXR0b25zID0gQXJyYXkuZnJvbShcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFnaW5hdGlvbl9fYnV0dG9uLS1qc1wiKVxyXG4gICk7XHJcbiAgXHJcbiAgYnV0dG9ucy5tYXAoYnV0dG9uID0+IHtcclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhZ2UgPSBlLnRhcmdldC50ZXh0Q29udGVudCAtIDE7XHJcbiAgICAgIHNob3dEYXRhKGRhdGEsIHN0YXRlLnBlclBhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZldGNoRGF0YSgpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);