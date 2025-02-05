import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Button, Icon } from '@shopify/polaris';
import './styles.css'
import { PiTextAaBold } from "react-icons/pi";
import { CgOrganisation } from "react-icons/cg";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import { FaFileAlt } from "react-icons/fa";
export function ModalPopup({ btn_text, activeFields, availableFields, handleAddField }) {
  const activeFieldsIds = activeFields.map((field) => field.id)
  const shopify = useAppBridge();
  const iconMapping = {
          PiTextAaBold: PiTextAaBold,
          CgOrganisation: CgOrganisation,
          FaLocationDot: FaLocationDot,
          FaPhone: FaPhone,
          TbWorld: TbWorld,
          CiDiscount1: CiDiscount1,
          FaFileAlt: FaFileAlt,
      };
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
                    <Icon
                      source={iconMapping[field.icon] || PiTextAaBold} // Default to TextFontListIcon if not found
                      tone="base"
                    />
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
