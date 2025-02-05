import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Button, Checkbox, Select, TextField } from '@shopify/polaris';
import {
    MinusCircleIcon,
    PlusIcon
} from '@shopify/polaris-icons';
const AddNewField = ({ fields, setFields, newField, setNewField }) => {
    const shopify = useAppBridge();
    const handleTempChange = (key, value) => {
        setNewField((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "type" && value === "radio"
                ? { options: [{ text: "", value: "" }, { text: "", value: "" }, { text: "", value: "" }] }
                : {})
        }));
    };

    const handleOptionChange = (index, key, value) => {
        const updatedOptions = [...newField.options];
        updatedOptions[index][key] = value;
        setNewField((prev) => ({ ...prev, options: updatedOptions }));
    };

    const addNewOptionRow = () => {
        setNewField((prev) => ({
            ...prev,
            options: [...prev.options, { text: "", value: "" }]
        }));
    };

    const removeOptionRow = (index) => {
        const updatedOptions = newField.options.filter((_, i) => i !== index);
        setNewField((prev) => ({ ...prev, options: updatedOptions }));
    };

    const handleAddField = () => {
        const lastId = fields.length > 0 ? fields[fields.length - 1].id : 0;
        const newId = lastId + 1;

        const updatedField = {
            id: newId,
            ...newField,
            active: true,
            position: newId
        };

        setFields([...fields, updatedField]);

        // Reset the form after adding
        setNewField({
            title: "",
            placeholder: "",
            required: false,
            type: "text",
            icon: "PiTextAaBold"
        });

        shopify.modal.hide("add-new-field");
    };


    return (
        <>
            <button onClick={() => shopify.modal.show('add-new-field')}>Add New Field</button>
            <Modal id="add-new-field">
                <div style={{ display: 'flex', flexDirection: "column", gap: "8px", padding: '16px' }}>
                    <TextField
                        label="Label Text"
                        value={newField.title}
                        onChange={(value) => handleTempChange("title", value)}
                    />
                    <TextField
                        label="Place Holder"
                        value={newField.placeholder}
                        onChange={(value) => handleTempChange("placeholder", value)}
                    />
                    <div style={{ display: 'flex' }}>
                        <Checkbox
                            label="Required"
                            checked={newField.required}
                            onChange={(checked) => handleTempChange("required", checked)}
                        />
                    </div>
                    <Select
                        label="Input Type"
                        value={newField.type}
                        options={[
                            { label: 'Text', value: 'text' },
                            { label: 'Number', value: 'number' },
                            // { label: 'Checkbox', value: 'checkbox' },
                            // {label: 'Multiple Checkbox', value: 'mulCheckbox'},
                            { label: 'Password', value: 'password' },
                            // { label: 'Radio', value: 'radio' },
                            { label: 'File', value: 'file' }
                        ]}
                        onChange={(value) => handleTempChange("type", value)}
                    />

                    {newField.type === "radio" && (
                        <div style={{ marginTop: "10px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Option Text</th>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Option Value</th>
                                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newField.options.map((option, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                                                    style={{ width: "100%", padding: "4px" }}
                                                    placeholder='Male'
                                                />
                                            </td>
                                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                <input
                                                    type="text"
                                                    value={option.value}
                                                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                                                    style={{ width: "100%", padding: "4px" }}
                                                    placeholder='male'
                                                />
                                            </td>
                                            <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                                {/* <button
                                                    onClick={() => removeOptionRow(index)}
                                                    disabled={newField.options.length <= 1}
                                                >
                                                    ❌
                                                </button> */}
                                                <Button
                                                    icon={MinusCircleIcon}
                                                    onClick={() => removeOptionRow(index)}
                                                    disabled={newField.options.length <= 1}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: "10px" }}>
                                <Button
                                    icon={PlusIcon}
                                    onClick={addNewOptionRow}
                                    variant='primary'
                                >
                                    Add Option
                                </Button>
                            </div>
                            {/* <button onClick={addNewOptionRow} style={{ marginTop: "10px" }}>➕ Add Option</button> */}
                        </div>
                    )}

                </div>

                <TitleBar title="Add New Field">
                    <button variant="primary" onClick={handleAddField}>Add</button>
                    <button onClick={() => shopify.modal.hide('add-new-field')}>Close</button>
                </TitleBar>
            </Modal>

        </>
    );
}

export default AddNewField