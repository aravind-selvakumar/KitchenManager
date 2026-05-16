import { useState } from 'react'
import { reportsApi } from '../services/api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function Reports() {
  const [reportType, setReportType] = useState('daily')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    setReport(null)
    try {
      let res
      if (reportType === 'daily') {
        res = await reportsApi.daily(date)
      } else if (reportType === 'monthly') {
        res = await reportsApi.monthly(parseInt(year), parseInt(month))
      } else {
        res = await reportsApi.custom(from, to)
      }
      setReport(res.data)
    } catch (err) {
      alert('Failed to generate report')
    } finally { setLoading(false) }
  }

  const exportPDF = () => {
    if (!report) return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Kitchen Stock - Usage Report', 14, 20)
    doc.setFontSize(11)
    doc.text(`Period: ${report.period.label}`, 14, 28)
    doc.text(`Type: ${report.period.type.toUpperCase()}`, 14, 34)

    const tableColumn = ['Product', 'Qty Used', 'Unit Cost', 'Total Cost']
    const tableRows = report.items.map(i => [
      i.productName,
      `${i.quantityUsed} ${i.productUnit}`,
      `₹${i.unitCost.toFixed(2)}`,
      `₹${i.totalCost.toFixed(2)}`
    ])
    tableRows.push(['', '', 'Grand Total', `₹${report.grandTotal.toFixed(2)}`])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      footStyles: { fillColor: [240, 240, 240] }
    })
    doc.save(`report-${report.period.type}-${Date.now()}.pdf`)
  }

  const exportExcel = () => {
    if (!report) return
    const data = report.items.map(i => ({
      Product: i.productName,
      'Quantity Used': `${i.quantityUsed} ${i.productUnit}`,
      'Unit Cost': i.unitCost,
      'Total Cost': i.totalCost
    }))
    data.push({ Product: 'GRAND TOTAL', 'Quantity Used': '', 'Unit Cost': '', 'Total Cost': report.grandTotal })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, `report-${report.period.type}-${Date.now()}.xlsx`)
  }

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ marginRight: 'auto' }}>Reports</h3>
        {report && (
          <>
            <button className="btn btn-warning" onClick={exportPDF}>Download PDF</button>
            <button className="btn btn-success" onClick={exportExcel}>Download Excel</button>
          </>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="report-controls">
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {reportType === 'daily' && (
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          )}

          {reportType === 'monthly' && (
            <>
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2020" max="2030" />
              </div>
              <div className="form-group">
                <label>Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)}>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {reportType === 'custom' && (
            <>
              <div className="form-group">
                <label>From</label>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="form-group">
                <label>To</label>
                <input type="date" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </>
          )}

          <button className="btn btn-primary" onClick={generateReport} disabled={loading} style={{ alignSelf: 'flex-end' }}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {report && (
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>{report.period.type.toUpperCase()} Report</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {report.period.label}
          </p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Used</th>
                  <th>Unit Cost</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {report.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productName}</td>
                    <td>{item.quantityUsed} {item.productUnit}</td>
                    <td>₹{item.unitCost.toFixed(2)}</td>
                    <td>₹{item.totalCost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Grand Total</td>
                  <td style={{ fontWeight: 700 }}>₹{report.grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
