import React, {
  Fragment,
  useState,
  useEffect,
  useRef
} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { getConfigs, editConfig } from "../actions/configs";

const ConfigItem = ({ data }) => {
  return Object.entries(data).map(entry => {
    return (
      <p key={`${entry[0]}_${entry[1]}`}>
        {entry[0]}: {typeof entry[1] === "boolean" ? entry[1].toString() : entry[1]}
      </p>
    )
  });
};

const compareObjects = (o1, o2) => {
  for (const p in o1) {
    if (p !== "isEditing" && o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (const p in o2) {
    if (p !== "isEditing" && o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
};

const Configs = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecords, setEditedRecords] = useState([]);
  const [focusedInput, setFocusedInput] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const inputRef = useRef({});

  const dispatch = useDispatch();
  const { configs, loading } = useSelector(state => state.configs);

  const history = useHistory();

  useEffect(() => {
    dispatch(getConfigs());
  }, [dispatch]);

  useEffect(() => {
    inputRef.current?.[focusedInput]?.focus();
    inputRef.current?.[focusedInput]?.type === "text" &&
      inputRef.current[focusedInput].setSelectionRange(selectionStart, selectionStart);
  }, [editedRecords, focusedInput, selectionStart]);

  const onChange = (type, name, val, id, st) => {
    const newRecords = editedRecords.map(rec => {
      if (rec.item_id === id) {
        if (type === "text") {
          return {
            ...rec,
            [name]: val
          }
        } else if (type === "number") {
          return {
            ...rec,
            [name]: Number(val)
          }
        } else if (type === "checkbox") {
          return {
            ...rec,
            [name]: val
          }
        }
      } else {
        return rec;
      }

      return null;
    });

    if (compareObjects(
      newRecords.find(item => item.item_id === id),
      configs.find(item => item.item_id === id )
    )) {
      setIsSaveEnabled(false);
    } else {
      setIsSaveEnabled(true);
    }

    setEditedRecords(newRecords);
    setFocusedInput(name);
    if (type === "text") setSelectionStart(st);
  };

  const onEditClick = id => {
    setIsEditing(true);

    const editedRecords = configs.map(cfg => {
      if (cfg.item_id === id) {
        return {
          ...cfg,
          isEditing: true
        };
      } else {
        return cfg;
      }
    });

    setEditedRecords(editedRecords);
  };

  const onEditCancelClick = () => {
    setEditedRecords([]);
    setIsEditing(false);
    setIsSaveEnabled(false);
  };

  const onSaveClick = id => {
    if (!isSaveEnabled) return;

    const editedRecord = editedRecords.find(rec => rec.item_id === id);
    const { isEditing, item_id, ...rest } = editedRecord;

    dispatch(editConfig(id, rest));

    setEditedRecords([]);
    setIsEditing(false);
    setIsSaveEnabled(false);
    // to unfocus from the last edited input
    setFocusedInput("");
  };

  const RecordInput = ({ id, rec }) => {
    return (
      <Fragment>
        {Object.entries(rec).map(entry => {
          if (entry[0] === "item_id") {
            return <div key={`${entry[0]}_${entry[1]}`}>item id: {entry[1]}</div>
          } else if (entry[0] !== "item_id" && typeof entry[1] === "string") {
            return (
              <div key={`${entry[0]}_${entry[1]}`}>
                <label htmlFor={`${entry[0]}`}>{entry[0]}</label>
                {" "}
                <input
                  name={`${entry[0]}`}
                  type="text"
                  value={entry[1]}
                  onChange={evt =>
                    onChange("text", evt.target.name, evt.target.value, id, evt.target.selectionStart)
                  }
                  ref={el => inputRef.current[`${entry[0]}`] = el}
                />
              </div>
            )
          } else if (typeof entry[1] === "number") {
            return (
              <div key={`${entry[0]}_${entry[1]}`}>
                <label htmlFor={`${entry[0]}`}>{entry[0]}</label>
                {" "}
                <input
                  name={`${entry[0]}`}
                  type="number"
                  value={entry[1]}
                  onChange={evt => onChange("number", evt.target.name, evt.target.value, id)}
                  ref={el => inputRef.current[`${entry[0]}`] = el}
                />
              </div>
            )
          } else if (entry[0] !== "isEditing" && typeof entry[1] === "boolean") {
            return (
              <div key={`${entry[0]}_${entry[1]}`}>
                <label htmlFor={`${entry[0]}`}>{entry[0]}</label>
                {" "}
                <input
                  name={`${entry[0]}`}
                  type="checkbox"
                  checked={entry[1]}
                  onChange={evt => onChange("checkbox", evt.target.name, evt.target.checked, id)}
                  ref={el => inputRef.current[`${entry[0]}`] = el}
                />
              </div>
            )
          } else {
            return null;
          }
        })}
        <input
          type="button"
          value="Cancel"
          onClick={onEditCancelClick}
        />
        {" "}
        <input
          type="button"
          disabled={!isSaveEnabled}
          value="Save"
          onClick={() => onSaveClick(id)}
        />
      </Fragment>
    );
  };

  return (
    <div>
      {loading
        ? <p>Loading...</p>
        : (
          <Fragment>
            <input type="button" value="Add a Record" onClick={() => history.push("/add")} />
            {!isEditing && configs?.length > 0 && configs.map(cfg =>
              <div key={cfg.item_id}>
                <ConfigItem key={uuidv4()} data={cfg} />
                <input type="button" value="Edit" onClick={() => onEditClick(cfg.item_id)} />
                <hr />
              </div>
            )}
            {isEditing && editedRecords?.length > 0 && editedRecords.map(rec => rec.isEditing
              ? (
                <Fragment key={rec.item_id}>
                  <RecordInput
                    id={rec.item_id}
                    rec={rec}
                  />
                  <hr />
                </Fragment>
              ) : (
                <Fragment key={rec.item_id}>
                  <ConfigItem key={uuidv4()} data={rec} />
                  <hr />
                </Fragment>
              )
            )}
          </Fragment>
        )
      }
    </div>
  );
};

export default Configs;
