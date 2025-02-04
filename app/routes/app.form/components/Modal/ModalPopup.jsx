import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';
import './styles.css'

export function ModalPopup({ btn_text, activeFields, availableFields, handleAddField }) {
  const activeFieldsIds = activeFields.map((field) => field.id)
  const shopify = useAppBridge();
  return (
    <>
      <Button
        onClick={() => shopify.modal.show('my-modal')}
        variant='primary'
      >
        {btn_text}
      </Button>
      <Modal id="my-modal" variant='large'>
        <div className="modal-container">
          {availableFields.map((field) => (
            <button
              key={field.id}
              onClick={() => handleAddField(field)}
              className='item'
              disabled={activeFieldsIds.includes(field.id)} // Disable if field.id exists in activeFields
            >
              {field.title}
            </button>
          ))}
        </div>
        <TitleBar title="Choose the field you wish to add">
        </TitleBar>
      </Modal>
    </>
  );
}
