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

export const Column = ({ fields, handleRemoveField, setFields }) => {

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
                    />;

                })}

            </SortableContext>
        </div>
    );
};

const Sortablefield = ({ field, handleRemoveField, required, setFields }) => {
    const shopify = useAppBridge();
    const id = field.id;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="field"
            onClick={() => shopify.modal.show('edit-field-modal')}

        >
            <Modal id="edit-field-modal" onShow={() => console.log('Modal is showing')}>
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", padding: '16px' }}>
                    <TextField
                        label="Label Text"
                        value={field.title}
                        // onChange=
                        autoComplete="off"
                    />
                    <TextField
                        label="Place Holder"
                        value={field.title}
                        // onChange={handleChange}
                        autoComplete="off"
                    />
                    <Checkbox
                        label="Required"
                        checked={required}
                    // onChange={handleChange}
                    />

                </div>
                <TitleBar title="Edit">
                    <button variant="primary" onClick={() => console.log('Saving')}>
                        Save
                    </button>
                    <button onClick={() => console.log('Cancelling')}>Cancel</button>
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
