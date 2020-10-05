'use strict';
const
  startButton = document.getElementById('start'),
  cancelButton = document.querySelector('#cancel'),
  incomeAddButton = document.getElementsByTagName('button')[0],
  expensesAddButton = document.getElementsByTagName('button')[1],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
  budgetMonthValue = document.querySelector('.budget_month-value'),
  expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
  additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
  targetMonthValue = document.getElementsByClassName('target_month-value')[0],
  expensesTitle = document.querySelectorAll('.expenses-title')[1],
  incomeTitle = document.querySelectorAll('.income-title')[1],
  salaryAmount = document.querySelector('.salary-amount'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  depositBank = document.querySelector('.deposit-bank'),
  depositAmount = document.querySelector('.deposit-amount'),
  depositPercent = document.querySelector('.deposit-percent');
let incomeItems = document.querySelectorAll('.income-items'),
  expensesItems = document.querySelectorAll('.expenses-items'),
  nameField = document.querySelectorAll('[placeholder = "Наименование"]'),
  sumField = document.querySelectorAll('[placeholder = "Сумма"]'),
  cookieArr;

const
  isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  setCookie = (key, value, maxAge, year, month, day, path, domain, secure) => {
    let cookieStr = `${encodeURI(key)}=${encodeURI(value)}; samesite=strict`;
    if (year) {
      const expires = new Date(year, month - 1, day);
      cookieStr += `; expires=${expires.toGMTString()}`;
    }

    cookieStr += path ? `; path=${encodeURI(path)}` : ``;
    cookieStr += domain ? `; domain=${encodeURI(domain)}` : ``;
    cookieStr += secure ? `; secure=${encodeURI(secure)}` : ``;
    cookieStr += maxAge ? `; max-age=${maxAge}` : ``;

    document.cookie = cookieStr;
  },

  getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  deleteCookie = (name) => {
    setCookie(name, '', -1);
  };

class AppData {
  constructor() {
    this.budget = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
  }

  start() {

    this.incomeMonth = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];

    this.budget = +salaryAmount.value;

    this.getExpInc();
    this.getExpensesMonth();
    this.getAddIncExp();
    this.getInfoDeposit();
    this.getBudget();

    this.showResult();
    this.saveData();
    startButton.style.display = 'none';
    cancelButton.style.display = 'inline-block';
  }

  reset() {
    const inputs = document.querySelectorAll('[type="text"]'),
      range = document.querySelector('[type="range"]');

    inputs.forEach((item) => {
      item.value = '';
    });
    range.value = 1;
    this.changePeriod();

    salaryAmount.disabled = false;
    incomeItems.forEach((item) => {
      const itemIncome = item.querySelector('.income-title'),
        cashIncome = item.querySelector('.income-amount');
      itemIncome.disabled = false;
      cashIncome.disabled = false;
    });
    additionalIncomeItem.forEach((item) => {
      item.disabled = false;
    });
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title'),
        cashExpenses = item.querySelector('.expenses-amount');
      itemExpenses.disabled = false;
      cashExpenses.disabled = false;
    });
    additionalExpensesItem.disabled = false;
    targetAmount.disabled = false;
    depositBank.disabled = false;
    depositAmount.disabled = false;
    depositCheck.checked = false;
    incomeAddButton.disabled = false;
    expensesAddButton.disabled = false;
    depositCheck.disabled = false;
    this.depositHandler();

    startButton.style.display = 'inline-block';
    cancelButton.style.display = 'none';

    localStorage.clear();
    cookieArr.forEach((item) => {
      deleteCookie(item);
    });
  }

  saveData() {
    setCookie('isLoad', true);
    setCookie('budget-month-value', budgetMonthValue.value);
    setCookie('budget-day-value', budgetDayValue.value);
    setCookie('expenses-month-value', expensesMonthValue.value);
    setCookie('additional-income-value', additionalIncomeValue.value);
    setCookie('additional-expenses-value', additionalExpensesValue.value);
    setCookie('income-period-value', incomePeriodValue.value);
    setCookie('target-month-value', targetMonthValue.value);

    localStorage.setItem('budget-month-value', budgetMonthValue.value);
    localStorage.setItem('budget-day-value', budgetDayValue.value);
    localStorage.setItem('expenses-month-value', expensesMonthValue.value);
    localStorage.setItem('additional-income-value', additionalIncomeValue.value);
    localStorage.setItem('additional-expenses-value', additionalExpensesValue.value);
    localStorage.setItem('income-period-value', incomePeriodValue.value);
    localStorage.setItem('target-month-value', targetMonthValue.value);
  }

  showResult() {
    budgetMonthValue.value = getCookie('isLoad') ? getCookie('budget-month-value') : this.budgetMonth;
    budgetDayValue.value = getCookie('isLoad') ? getCookie('budget-day-value') : this.budgetDay;
    expensesMonthValue.value = getCookie('isLoad') ? getCookie('expenses-month-value') : this.expensesMonth;
    additionalExpensesValue.value = getCookie('isLoad') ? getCookie('additional-expenses-value') : this.addExpenses.join(', ');
    additionalIncomeValue.value = getCookie('isLoad') ? getCookie('additional-income-value') : this.addIncome.join(', ');
    targetMonthValue.value = getCookie('isLoad') ? getCookie('target-month-value') : Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = getCookie('isLoad') ? getCookie('income-period-value') : this.calcSavedMoney();

    periodSelect.addEventListener('input', () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });

    this.disableInputs();
  }

  disableInputs() {
    salaryAmount.disabled = true;
    incomeItems.forEach((item) => {
      const itemIncome = item.querySelector('.income-title'),
        cashIncome = item.querySelector('.income-amount');
      itemIncome.disabled = true;
      cashIncome.disabled = true;
    });
    additionalIncomeItem.forEach((item) => {
      item.disabled = true;
    });
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title'),
        cashExpenses = item.querySelector('.expenses-amount');
      itemExpenses.disabled = true;
      cashExpenses.disabled = true;
    });
    additionalExpensesItem.disabled = true;
    targetAmount.disabled = true;
    depositAmount.disabled = true;
    depositPercent.disabled = true;
    depositBank.disabled = true;
    incomeAddButton.disabled = true;
    expensesAddButton.disabled = true;
    depositCheck.disabled = true;
  }

  validate() {
    sumField.forEach(item => {
      item.addEventListener('input', () => {
        const symbol = item.value[item.value.length - 1];

        if (/^[0-9]/.test(symbol)) {
          return;
        } else {
          item.value = item.value.substring(0, [item.value.length - 1]);
        }
      });
    });
    nameField.forEach(item => {
      item.addEventListener('input', () => {
        const symbol = item.value[item.value.length - 1];

        if (/^[а-яА-Я]/.test(symbol)) {
          return;
        } else {
          item.value = item.value.substring(0, [item.value.length - 1]);
        }
      });
    });
  }

  addIncExpBlock(target) {
    const startStr = target.className.split(' ')[1].split('_')[0];
    let items = document.querySelectorAll(`.${startStr}-items`);
    const addButton = document.querySelector(`.${startStr}_add`),
      cloneItems = items[0].cloneNode(true);

    cloneItems.children[0].value = '';
    cloneItems.children[1].value = '';
    items[0].parentNode.insertBefore(cloneItems, addButton);
    items = document.querySelectorAll(`.${startStr}-items`);
    nameField = document.querySelectorAll('[placeholder = "Наименование"]');
    sumField = document.querySelectorAll('[placeholder = "Сумма"]');

    if (items.length === 3) {
      addButton.style.display = 'none';
    }

    this.validate();
  }

  getExpInc() {
    const count = (item) => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value,
        itemAmount = item.querySelector(`.${startStr}-amount`).value;

      if (isNumber(itemAmount) && !isNumber(itemTitle) && itemTitle !== '') {
        this[startStr][itemTitle] = +itemAmount;
      }
    };

    incomeItems.forEach(count);
    expensesItems.forEach(count);

    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  getAddIncExp() {
    const getAddItem = (array, item) => {
      if (item.length === undefined) {
        item.value.split(',').forEach((item) => {
          if (item !== '') {
            array.push(item);
          }
        });
      } else {
        item.forEach((item) => {
          array.push(item.value);
        });
      }
    };

    getAddItem(this.addIncome, additionalIncomeItem);
    getAddItem(this.addExpenses, additionalExpensesItem);
  }

  getExpensesMonth() {
    for (let prop in this.expenses) {
      this.expensesMonth += +this.expenses[prop];
    }
  }

  getBudget() {
    const monthDeposit = this.moneyDeposit * this.percentDeposit / 100;
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.ceil(this.budgetMonth / 30);
  }

  getTargetMonth() {
    return targetAmount.value / this.budgetMonth;
  }

  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }

  changePeriod() {
    const periodAmount = document.querySelector('.period-amount');
    periodAmount.textContent = periodSelect.value;
  }

  showAddExpenses() {
    const arr = [];
    this.addExpenses.forEach(item => {
      arr.push(item[0].toUpperCase() + item.substr(1));
    });
    return arr.join(', ');
  }

  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = +depositPercent.value;
      this.moneyDeposit = +depositAmount.value;
    }
  }

  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.disabled = false;
    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = +valueSelect;
    }
  }

  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
  }

  eventsListeners() {
    startButton.addEventListener('click', () => {

      if (depositBank.value === '' || depositAmount.value === '' || depositPercent.value === '') {
        depositCheck.checked = false;
        this.depositHandler();
      } else if (depositBank.value === '0') {
        alert('Выберете банк');
        return;
      } else if (!isNumber(+depositPercent.value) || +depositPercent.value > 100 || +depositPercent.value < 0) {
        alert('Введите корректное значение в поле проценты');
        return;
      }
      return !isNumber(salaryAmount.value) ? event.preventDefault() : this.start();
    });
    cancelButton.addEventListener('click', () => this.reset());
    expensesAddButton.addEventListener('click', (e) => this.addIncExpBlock(e.target));
    incomeAddButton.addEventListener('click', (e) => this.addIncExpBlock(e.target));
    periodSelect.addEventListener('input', () => this.changePeriod());
    depositCheck.addEventListener('change', this.depositHandler.bind(this));
    this.validate();
  }
}

const appData = new AppData();
appData.eventsListeners();

cookieArr = document.cookie.split('; ');

if (getCookie('isLoad')) {
  cookieArr.forEach((item) => {
    const key = item.split('=', 1).join();
    if (localStorage.getItem(key) !== getCookie(key) && key !== 'isLoad' || localStorage.length !== cookieArr.length - 1) {
      appData.reset();
    }
  });

}

if (getCookie('isLoad')) {
  appData.showResult();
  appData.disableInputs();

  startButton.style.display = 'none';
  cancelButton.style.display = 'inline-block';
}