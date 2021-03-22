import React, {
  Fragment,
  useState,
  useEffect,
  useCallback
} from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addConfig } from "../actions/configs";

const AddConfig = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [value, setValue] = useState("");
  const [number, setNumber] = useState(0);
  const [checked, setChecked] = useState(false);
  const [canAddProp, setCanAddProp] = useState(false);
  const [record, setRecord] = useState({ item_id: uuidv4() });

  const dispatch = useDispatch();
  const history = useHistory();

  const { loading } = useSelector(state => state.configs);

  const testCanAddProp = useCallback(() => {
    if (name) {
      return setCanAddProp(true);
    }

    return setCanAddProp(false);
  }, [name]);

  useEffect(() => {
    testCanAddProp();
  }, [value, number, checked, testCanAddProp]);

  const onNameChange = evt => {
    setName(evt.target.value);
  };

  const onTypeChange = evt => {
    setType(evt.target.value);
    setValue("");
    setNumber(0);
    setChecked(false);
  };

  const onValueChange = evt => {
    setValue(evt.target.value);
  };

  const onNumberChange = evt => {
    setNumber(Number(evt.target.value));
  };

  const onCheckedChange = evt => {
    setChecked(evt.target.checked);
  };

  const onAddClick = () => {
    setRecord({
      ...record,
      data: {
        ...record.data,
        // assume empty string is allowed for text input
        [name]: value || checked || number
      }
    });
  };

  const onSubmit = async () => {
    await dispatch(addConfig(record));
    history.push("/");
  };

  return (
    <Fragment>
      <input type="button" value="Go to the Record List" onClick={() => history.push("/")} />
      {loading
        ? <p>Loading...</p>
        : (
          <Fragment>
            <p>Name: <input type="text" value={name} onChange={onNameChange} /></p>
            <p>Type:&nbsp;
              <select onChange={onTypeChange}>
                <option value="text">text</option>
                <option value="boolean">boolean</option>
                <option value="number">number</option>
              </select>
            </p>
            <p>Value:&nbsp;
              {type === "boolean" &&
                <input type="checkbox" checked={checked} onChange={onCheckedChange} />
              }
              {type === "text" &&
                <input type="text" value={value} onChange={onValueChange} />
              }
              {type === "number" &&
                <input type="number" value={number} onChange={onNumberChange} />
              }
            </p>
            <input
              type="button"
              disabled={!canAddProp}
              value="Add Prop"
              onClick={onAddClick}
            />
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
