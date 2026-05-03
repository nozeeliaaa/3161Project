export default function Table({ columns, rows, getKey }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-200 text-sm">
          <thead className="bg-ink-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-semibold text-ink-600">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-white">
            {rows.map((row, index) => (
              <tr key={getKey ? getKey(row) : index} className="hover:bg-ink-50/70">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-ink-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
