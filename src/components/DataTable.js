function DataTable({ data }) {
    if (data.length === 0) return null;
  
    const headers = ['Item', ...data[0].years];
  
    return (
      <table>
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.name}>
              <td>{item.name}</td>
              {item.values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }