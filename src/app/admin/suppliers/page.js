import React from 'react'
import ImportSuppliers from '../../components/DragAndDrop/ImportSuppliers'
import ExportButton from '../../components/exportcsv/ExportButton'
function Suppliers() {
  return (
    <div>Suppliers
        <ExportButton api={`export/suppliers`} name="suppliers" />
        <ImportSuppliers/>
    </div>
  )
}

export default Suppliers