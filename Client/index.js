(function () {
  let employeeData = [];
  let paginationConfig = {};
  let currentPage = 1;

  const searchElement = document.getElementById("search");
  const tableElement = document.getElementById("table-container");
  const paginationElement = document.querySelector(".pagination");
  const selectElement = document.getElementById("select");
  const tableGroupElement = document.getElementById("tableGroup-container");

  async function networkCall() {
    const data = await fetch("http://localhost:8080/getEmployeeData");
    employeeData = await data.json();
    renderComponent(employeeData.data);
  }

  // render table and pagination component
  const renderComponent = (empData) => {
    renderTable(empData);
    renderPagination();
  };

  // Table rendering function
  const renderTable = (empData) => {
    const tableData = calData(empData);
    const rowBody = document.getElementsByTagName("tbody")[0];
    const rows = tableData.map((emp, i) => tableRow(emp)).join(" ");
    if (rowBody) {
      rowBody.parentNode.removeChild(rowBody);
    }
    tableElement.insertAdjacentHTML("beforeend", rows);
  };

  const calData = (data) => {
    const cloneData = [...data];
    paginationConfig = paginate(cloneData.length, currentPage);
    return data.slice(paginationConfig.startIndex, paginationConfig.endIndex);
  };

  //pagination rendering function
  const renderPagination = () => {
    const { pages } = paginationConfig;
    if (pages.length > 0) {
      if (paginationElement.firstChild) {
        paginationElement.removeChild(paginationElement.firstChild);
      }
      const createDiv = document.createElement("div");
      const pagesEl = pages
        .map((page, i) => {
          let id = "p" + page;
          return `<a data-id=${page} id="${id}">${page}</a>`;
        })
        .join(" ");
      createDiv.insertAdjacentHTML("beforeend", pagesEl);
      paginationElement.insertAdjacentElement("beforeend", createDiv);
      const anchorElement = document.getElementById("p" + currentPage);
      anchorElement.className = "active";
    } else {
      paginationElement.removeChild(paginationElement.firstChild);
    }
  };

  //On search change
  const searchHandler = (e) => {
    const text = e.target.value.toLowerCase();
    const filterData = calData(employeeData.data).filter(
      (emp, i) =>
        emp.name.toLowerCase().includes(text) ||
        emp.position.toLowerCase().includes(text) ||
        emp.office.toLowerCase().includes(text)
    );
    renderTable(filterData);
  };

  // on pagination change
  const paginationHandler = (e) => {
    const newPage = e.target.dataset.id;
    const anchorElement = document.getElementById("p" + currentPage);
    const newAnchorEl = document.getElementById("p" + newPage);
    anchorElement.className = "";
    currentPage = +newPage;
    newAnchorEl.className = "active";
    renderTable(employeeData.data);
  };

  

  const renderGroupHeader = (userSelection) => {
    tableGroupElement.querySelectorAll("th").forEach((el, i) => {
      if (i == 0) {
        el.innerHTML = userSelection === "position" ? "Position" : "Office";
      } else {
        el.innerHTML = "Name";
      }
    });
  };

  const manageView = (select) => {
    if (select) {
      tableElement.classList.add("visible");
      paginationElement.classList.add("visible");
      searchElement.classList.add("visible");
      tableGroupElement.classList.remove("visible");
    } else {
      tableGroupElement.classList.add("visible");
      tableElement.classList.remove("visible");
      paginationElement.classList.remove("visible");
      searchElement.classList.remove("visible");
    }
  };

  // on change of select
  const selectHandler = (e) => {
    const userSelection = e.target.value;
    if (userSelection) {
      manageView(true);
      const rowBody = document.getElementsByTagName("tbody")[1];
      if (rowBody) {
        rowBody.parentNode.removeChild(rowBody);
      }
      const groupEmpData = groupBy(userSelection, employeeData);
      var groupHtml;
      for (let key in groupEmpData) {
        groupHtml = groupHtml
          ? groupHtml + renderGroup(groupEmpData, key, userSelection)
          : renderGroup(groupEmpData, key, userSelection);
      }
      renderGroupHeader(userSelection);
      tableGroupElement.insertAdjacentHTML("beforeend", groupHtml);
    } else {
      manageView(false);
    }
  };

  //Api call
  networkCall();

  //Click handler
  selectElement.addEventListener("change", selectHandler);
  paginationElement.addEventListener("click", paginationHandler);
  searchElement.addEventListener("input", searchHandler);
})();
