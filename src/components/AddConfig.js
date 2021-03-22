import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addConfig } from "../actions/configs";

const AddConfig = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [record, setRecord] = useState({ item_id: uuidv4() });

  const dispatch = useDispatch();
  const history = useHistory();

  const { loading } = useSelector(state => state.configs);

  const onNameChange = evt => {
    setName(evt.target.value);
  };

  const onTypeChange = evt => {
    setType(evt.target.value);
    setValue("");
  };

  const onValueChange = evt => {
    setValue(evt.target.value);
  };

  const onCheckedChange = evt => {
    setChecked(evt.target.checked);
  };

  const onAddClick = () => {
    setRecord({
      ...record,
      data: {
        ...record.data,
        [name]: value || checked
      }
    });
  };

  const onSubmit = async () => {
    await dispatch(addConfig(record));
    history.push("/");
  };

  return (
    <Fragment>
      {loading
        ? <p>Loading...</p>
        : (
          <Fragment>
            <p>Name: <input type="text" value={name} onChange={onNameChange} /></p>
            <p>Type:
              <select onChange={onTypeChange}>
                <option value="text">text</option>
                <option value="boolean">boolean</option>
                <option value="number">number</option>
              </select>
            </p>
            <p>Value:
              {type === "boolean"
                ? (
                  <input type="checkbox" checked={checked} onChange={onCheckedChange} />
                )
                : (
                  <input type={type} value={value} onChange={onValueChange} />
                )
              }
            </p>
            <input type="button" value="Add Prop" onClick={onAddClick} />
            <hr />
              {record.data && Object.entries(record.data).map(entry =>
                <p key={uuidv4()}>{entry[0]}: {typeof entry[1] === "boolean" ? entry[1].toString() : entry[1]}</p>
              )}
            <hr />
            <input
              type="button"
              disabled={Object.keys(record).length <= 1}
              value="Submit Record"
              onClick={onSubmit}
            />
          </Fragment>
        )
      }
    </Fragment>
  );
};

export default AddConfig;
