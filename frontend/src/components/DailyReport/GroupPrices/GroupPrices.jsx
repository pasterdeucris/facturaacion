import { Modal } from 'antd';

function GroupPrices({ showModalGroups, setShowModalGroups, groupsValues, subgroupsValues }) {
  return (
    <Modal
      title="Grupos y subgrupos"
      visible={showModalGroups}
      onCancel={() => { setShowModalGroups(false); }}
      width={1000}
      forceRender
    >
    { 
      groupsValues.length > 0 && groupsValues.map((item, idx) => (
          <li><strong>{item.nombre} - {item.total}</strong></li>
      ))
		}
    <hr />
    { 
      subgroupsValues.length > 0 && subgroupsValues.map((item, idx) => (
          <li><strong>{item.nombre} - {item.total}</strong></li>
      ))
		}
    </Modal>
  )

}

export default GroupPrices;