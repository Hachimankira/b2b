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
          {Object.entries(availableFields).map(([category, fields]) => (
            <div key={category}>
              <h3>{category.toUpperCase()}</h3> {/* Category Heading */}
              <div className='items'>
                {fields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => handleAddField(field)}
                    className='item'
                    disabled={activeFieldsIds.includes(field.id)}
                  >
                    {field.title}
                  </button>
                ))}
              </div>
            </div>
          ))}

        </div>
        <TitleBar title="Choose the field you wish to add">
        </TitleBar>
      </Modal>
    </>
  );
}
