
const tableRow = (emp) => {
    const TableRow = `
                <tr data-id=${emp.id}>
                    <td>${emp.name}</td>
                    <td>${emp.position}</td>
                    <td>${emp.office}</td>
                </tr>
            `;
    return TableRow;
  };

  const renderGroup = (data, key, userSelection) => {
    const label = userSelection === "position" ? "office" : "position";
    const createTD = data[key]
      .map((el, i) => `<div>${el.name} (${el[label]})</div>`)
      .join(" ");
    const html = `<tr>
            <td>${key}</td>
            <td>${createTD}</td>
      </tr>`;
    return html;
  };