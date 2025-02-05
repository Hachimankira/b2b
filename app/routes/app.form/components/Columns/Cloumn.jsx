import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Column.css";
import {
    DragHandleIcon,
    MinusCircleIcon
} from '@shopify/polaris-icons';
import { Button, Checkbox, Icon, TextField } from "@shopify/polaris";

// import for modal popup
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { useEffect, useState } from "react";

export const Column = ({ fields, handleRemoveField, setFields, handleChangeField }) => {

    return (
        <div className="column">
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                {fields.map((field) => {
                    const required = field.required;
                    return <Sortablefield
                        key={field.id}
                        // id={field.id}
                        // title={field.title}
                        handleRemoveField={handleRemoveField}
                        required={required}
                        field={field}
                        setFields={setFields}
                        handleChangeField={handleChangeField}
                    />;

                })}

            </SortableContext>
        </div>
    );
};

const Sortablefield = ({ key, field, handleRemoveField, required, setFields, handleChangeField }) => {
    const shopify = useAppBridge();
    const id = field.id;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const [tempField, setTempField] = useState(field); // Temporary local state

    useEffect(() => {
        setTempField(field); // Update local state when the modal opens
    }, [field]); // Re-run when `field` changes

    const handleTempChange = (key, value) => {
        setTempField((prev) => ({
            ...prev,
            [key]: value, // Update local state
        }));
    };

    const handleSave = () => {
        handleChangeField(tempField.id, "title", tempField.title);
        handleChangeField(tempField.id, "placeholder", tempField.placeholder);
        handleChangeField(tempField.id, "required", tempField.required);
        shopify.modal.hide(`edit-field-modal-${id}`);
    };

    const handleCancel = () => {
        setTempField(field); 
        shopify.modal.hide(`edit-field-modal-${id}`);
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            className="field"
            onClick={() => shopify.modal.show(`edit-field-modal-${id}`)}
        >
            <Modal id={`edit-field-modal-${id}`} onShow={() => console.log('Modal is showing', id, field)}>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", padding: '16px' }}>
                    <TextField
                        label="Label Text"
                        value={tempField.title}
                        onChange={(value) => handleTempChange("title", value)}
                    />
                    <TextField
                        label="Place Holder"
                        value={tempField.placeholder || ""}
                        onChange={(value) => handleTempChange("placeholder", value)}
                        autoComplete="off"
                    />
                    <Checkbox
                        label="Required"
                        checked={tempField.required}
                        onChange={(value) => handleTempChange("required", value)}
                    />
                </div>
                <TitleBar title="Edit">
                    <button variant="primary" onClick={handleSave}> {/* Save only when clicked */}
                        Save
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                </TitleBar>
            </Modal>

            {/* field Content */}
            <div className="field-content">{field.title}</div>
            {/* Drag Handle */}
            <div>
                <Button
                    icon={MinusCircleIcon}
                    accessibilityLabel="Add theme"
                    onClick={() => handleRemoveField(id)}
                    disabled={required}
                />
            </div>
            <div {...listeners} {...attributes} className="drag-handle">
                <Icon
                    source={DragHandleIcon}
                    tone="base"
                />
            </div>

        </div>
    );
};
